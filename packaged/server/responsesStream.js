//#region app/src/server/responsesStream.ts
const terminalTypes = /* @__PURE__ */ new WeakMap();
function responseStreamTerminalType(data) {
	return data && typeof data === "object" ? terminalTypes.get(data) || "not-streamed" : "not-streamed";
}
/** Consume actual Responses SSE. Prose/tool arguments stay server-private until
* the complete response, receipt validation and canonical commit have succeeded. */
async function readResponsesStream(response, signal, onProgress) {
	if (!response.headers.get("Content-Type")?.includes("text/event-stream") || !response.body) throw Error("MODEL_PROTOCOL_ERROR");
	const reader = response.body.getReader(), decoder = new TextDecoder("utf-8", { fatal: true });
	let buffer = "", bytes = 0, events = 0, receivedBytes = 0, lastSequence = -1, terminal;
	const progress = (phase) => {
		try {
			onProgress?.({
				phase,
				receivedBytes
			});
		} catch {}
	};
	try {
		while (!terminal) {
			signal.throwIfAborted();
			const { done, value } = await reader.read();
			signal.throwIfAborted();
			if (done) throw Error("MODEL_RESPONSE_INCOMPLETE");
			bytes += value.byteLength;
			if (bytes > 1048576) throw Error("MODEL_PROTOCOL_LIMIT");
			buffer += decoder.decode(value, { stream: true });
			buffer = buffer.replace(/\r\n/g, "\n");
			let end;
			while ((end = buffer.indexOf("\n\n")) >= 0) {
				const frame = buffer.slice(0, end);
				buffer = buffer.slice(end + 2);
				const data = frame.split("\n").filter((x) => x.startsWith("data:")).map((x) => x.slice(5).trimStart()).join("\n");
				if (!data) continue;
				if (++events > 5e3) throw Error("MODEL_PROTOCOL_LIMIT");
				let event;
				try {
					event = JSON.parse(data);
				} catch {
					throw Error("MODEL_PROTOCOL_ERROR");
				}
				if (!event || typeof event.type !== "string") throw Error("MODEL_PROTOCOL_ERROR");
				if (event.sequence_number !== void 0) {
					if (!Number.isSafeInteger(event.sequence_number) || event.sequence_number <= lastSequence) throw Error("MODEL_PROTOCOL_ERROR");
					lastSequence = event.sequence_number;
				}
				if (event.type === "error") throw Error("MODEL_UNAVAILABLE");
				if (event.type.endsWith(".delta")) {
					if (typeof event.delta !== "string") throw Error("MODEL_PROTOCOL_ERROR");
					receivedBytes += new TextEncoder().encode(event.delta).length;
					progress("receiving");
				}
				if ([
					"response.completed",
					"response.incomplete",
					"response.failed"
				].includes(event.type)) {
					if (!event.response || typeof event.response !== "object" || Array.isArray(event.response)) throw Error("MODEL_PROTOCOL_ERROR");
					terminal = event.response;
					terminalTypes.set(terminal, event.type);
					progress("validating");
					break;
				}
			}
		}
		return terminal;
	} finally {
		try {
			await reader.cancel();
		} catch {}
		reader.releaseLock();
	}
}
//#endregion
export { readResponsesStream, responseStreamTerminalType };
