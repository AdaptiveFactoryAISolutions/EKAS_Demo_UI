import { definitions } from "../inputs/metric-oracle/metric-contract.js";
//#region app/src/platform/metricEngine.ts
const metricDefinitions = definitions;
var EligibilityError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
const scalar = (x) => {
	if (typeof x !== "number" || !Number.isFinite(x)) throw new EligibilityError("invalid_formula", "Expected a finite numeric operand.");
	return x;
};
const vector = (x) => {
	if (!Array.isArray(x) || !x.length || x.some((v) => !Number.isFinite(v))) throw new EligibilityError("missing_input", "A nonempty numeric cohort is required.");
	return x;
};
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const sd = (a) => {
	if (a.length < 2) throw new EligibilityError("unsupported", "Sample standard deviation needs at least two observations.");
	const m = mean(a);
	return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1));
};
/** Bounded arithmetic parser, no eval/Function/property access or executable saved code. */
function evaluateExpression(expression, inputs) {
	const tokens = expression.match(/[A-Za-z_][A-Za-z_0-9]*|\d+(?:\.\d+)?|[()+\-*/,]/g) || [];
	if (tokens.join("") !== expression.replace(/\s/g, "") || tokens.length > 256) throw new EligibilityError("invalid_formula", "Unsupported arithmetic grammar.");
	let index = 0;
	const input = (name) => {
		if (!Object.hasOwn(inputs, name) || inputs[name] === null || inputs[name] === void 0) throw new EligibilityError("missing_input", "Missing operand: " + name);
		const value = inputs[name];
		if (value && typeof value === "object" && !Array.isArray(value) && value.masked === true) throw new EligibilityError("masked", "Masked dependency: " + name);
		if (typeof value === "number" && Number.isFinite(value) || typeof value === "string" || typeof value === "boolean" || Array.isArray(value) && value.every((v) => typeof v === "number" && Number.isFinite(v))) return value;
		throw new EligibilityError("invalid_formula", "Invalid operand: " + name);
	};
	const functions = {
		min: (a) => Math.min(...a.map(scalar)),
		max: (a) => Math.max(...a.length === 1 && Array.isArray(a[0]) ? vector(a[0]) : a.map(scalar)),
		sqrt: (a) => {
			const n = scalar(a[0]);
			if (n < 0) throw new EligibilityError("invalid_formula", "Square-root input must be nonnegative.");
			return Math.sqrt(n);
		},
		exp: (a) => Math.exp(scalar(a[0])),
		product: (a) => vector(a[0]).reduce((s, v) => s * v, 1),
		mean: (a) => mean(vector(a[0])),
		sample_sd: (a) => sd(vector(a[0])),
		ols_slope: (a) => {
			const x = vector(a[0]), y = vector(a[1]);
			if (x.length !== y.length || x.length < 2) throw new EligibilityError("unsupported", "Aligned chronological observations required.");
			const xm = mean(x), ym = mean(y), den = x.reduce((s, v) => s + (v - xm) ** 2, 0);
			if (den <= 0) throw new EligibilityError("zero_denominator", "Time offsets have zero variation.");
			return x.reduce((s, v, i) => s + (v - xm) * (y[i] - ym), 0) / den;
		},
		all_threshold: (a) => {
			const values = vector(a[0]), threshold = scalar(a[1]), direction = a[2];
			if (direction !== "lower" && direction !== "higher") throw new EligibilityError("invalid_formula", "Metric benefit direction is required.");
			return values.every((v) => direction === "lower" ? v <= threshold : v >= threshold);
		}
	};
	const atom = () => {
		const token = tokens[index++];
		if (token === "(") {
			const n = sum();
			if (tokens[index++] !== ")") throw new EligibilityError("invalid_formula", "Unclosed expression.");
			return n;
		}
		if (token === "-") return -scalar(atom());
		if (token === "+") return scalar(atom());
		if (token && /^\d/.test(token)) return Number(token);
		if (token && /^[A-Za-z_]/.test(token)) {
			if (tokens[index] !== "(") return input(token);
			index++;
			const args = [];
			if (tokens[index] !== ")") {
				args.push(sum());
				while (tokens[index] === ",") {
					index++;
					args.push(sum());
				}
			}
			if (tokens[index++] !== ")" || !functions[token]) throw new EligibilityError("invalid_formula", "Unsupported function.");
			return functions[token](args);
		}
		throw new EligibilityError("invalid_formula", "Invalid expression token.");
	};
	const product = () => {
		let n = atom();
		while (tokens[index] === "*" || tokens[index] === "/") {
			const op = tokens[index++], right = scalar(atom());
			if (op === "/" && right <= 0) throw new EligibilityError("zero_denominator", "Denominator must be strictly positive.");
			n = op === "*" ? scalar(n) * right : scalar(n) / right;
		}
		return n;
	};
	const sum = () => {
		let n = product();
		while (tokens[index] === "+" || tokens[index] === "-") {
			const op = tokens[index++], r = scalar(product());
			n = op === "+" ? scalar(n) + r : scalar(n) - r;
		}
		return n;
	};
	const result = sum();
	if (index !== tokens.length || typeof result !== "number" && typeof result !== "boolean" || typeof result === "number" && !Number.isFinite(result)) throw new EligibilityError("invalid_formula", "Nonfinite or incomplete calculation.");
	return result;
}
function evaluateMetric(metricId, inputs, policy) {
	const definition = metricDefinitions.find((d) => d.id === metricId);
	const base = {
		metricId,
		definitionVersion: "independent-metric-contract-1.0",
		unit: definition?.unit || "unknown",
		synthetic: true,
		qualified: false
	};
	try {
		if (!definition) throw new EligibilityError("unsupported", "Unknown metric identity; no alias fallback.");
		if (policy.namespace.startsWith("northworks") && policy.revision === "P3") throw new EligibilityError("unsupported", "No eligible Northworks P3 data; training records are never substituted.");
		if (policy.masked) throw new EligibilityError("masked", "A required dependency is masked.");
		if (policy.future) throw new EligibilityError("future_record", "Observation is later than the explicit cutoff.");
		if (policy.coverage !== void 0 && policy.coverage < 1) throw new EligibilityError("partial_coverage", "Incomplete eligible observation coverage.");
		if ([
			"ekas.cp",
			"ekas.cpk",
			"ekas.pp",
			"ekas.ppk"
		].includes(metricId)) {
			if (typeof inputs.usl === "number" && typeof inputs.lsl === "number" && inputs.usl <= inputs.lsl) throw new EligibilityError("invalid_formula", "Upper specification limit must exceed lower limit.");
			if (policy.mode === "observed" && ((policy.sampleN || 0) < 125 || policy.msaStatus !== "qualified" || policy.stabilityStatus !== "stable" || !policy.subgroupDesign)) throw new EligibilityError("unsupported", "Capability qualification incomplete: sample adequacy, MSA, stability and subgroup policy are required.");
		}
		let value = evaluateExpression(definition.expression, inputs);
		if (definition.expression.startsWith("product(") && definition.unit === "%" && typeof value === "number") value *= 100;
		return {
			...base,
			value,
			availability: "observed",
			reason: policy.mode === "algebra_only" ? "Illustrative arithmetic cohort only; not an observed qualified plant metric." : null
		};
	} catch (e) {
		return {
			...base,
			value: null,
			availability: e instanceof EligibilityError ? e.status : "invalid_formula",
			reason: e instanceof Error ? e.message : "Invalid calculation"
		};
	}
}
function intervalUnion(intervals, window) {
	const clipped = intervals.map(([a, b]) => [Math.max(a, window[0]), Math.min(b, window[1])]).filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
	let total = 0, start = NaN, end = NaN;
	for (const [a, b] of clipped) if (Number.isNaN(start)) {
		start = a;
		end = b;
	} else if (a <= end) end = Math.max(end, b);
	else {
		total += end - start;
		start = a;
		end = b;
	}
	return total + (Number.isNaN(start) ? 0 : end - start);
}
//#endregion
export { evaluateExpression, evaluateMetric, intervalUnion, metricDefinitions };
