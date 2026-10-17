# EKAS Wiki

This Wiki is the authoritative reference for how to use EKAS and for the frontend engineering of this demo. The accepted source is RC3 `45568c575a00a8810b661929624995ec24e6de1e`. Status: **PENDING** independent review.

EKAS is a chat-first governed manufacturing decision-intelligence system. It is not generic BI. MES executes and records. EKAS interprets, connects evidence, governs decisions, and verifies outcomes. EKAS does not replace MES.

## Pages

1. [Overview](01-overview.md)
2. [Quick start](02-quick-start.md)
3. [Using EKAS](03-using-ekas.md)
4. [Journeys](04-journeys.md)
5. [Frontend architecture](05-frontend-architecture.md)
6. [API and backend integration](06-api-and-backend-integration.md)
7. [Demo vs production](07-demo-vs-production.md)
8. [Dashboards and visualization](08-dashboards-and-visualization.md)
9. [Testing and acceptance](09-testing-and-acceptance.md)
10. [Security and trust boundaries](10-security-and-trust-boundaries.md)
11. [Developer guide](11-developer-guide.md)
12. [Release and deployment](12-release-and-deployment.md)
13. [Current limitations](13-current-limitations.md)
14. [Production backend gaps](14-production-backend-gaps.md)
15. [Architecture decisions](15-architecture-decisions.md)
16. [Claim to fame / product doctrine](16-claim-to-fame.md)
17. [PLC to P&L strategy](17-plc-to-pl-strategy.md)
18. [MES boundary / execution data model](18-mes-boundary.md)
19. [Build method, engineering quality, and known risks](19-build-method-engineering-quality-and-known-risks.md)
20. [Glossary](20-glossary.md)
21. [Decision execution model](21-decision-execution-model.md)
22. [EKAS Manufacturing AI Maturity Model](22-manufacturing-ai-maturity-model.md)

## Cross-system context, identity, and lineage

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.** This section does not change RC3 and does not create RC4. Start at [Cross-system manufacturing data](cross-system/01-cross-system-manufacturing-data.md).

1. [Cross-system manufacturing data](cross-system/01-cross-system-manufacturing-data.md)
2. [System ownership boundaries](cross-system/02-system-ownership-boundaries.md)
3. [Canonical EKAS identity model](cross-system/03-canonical-ekas-identity-model.md)
4. [Entity resolution](cross-system/04-entity-resolution.md)
5. [Evidence lineage](cross-system/05-evidence-lineage.md)
6. [Cross-system correlation rules](cross-system/06-cross-system-correlation-rules.md)
7. [Adapter normalization](cross-system/07-adapter-normalization.md)
8. [Integration acceptance tests](cross-system/08-integration-acceptance-tests.md)
9. [Known data quality risks](cross-system/09-known-data-quality-risks.md)
10. [Production integration roadmap](cross-system/10-production-integration-roadmap.md)
11. [Product / part identity and PLM context](cross-system/11-product-part-identity-and-plm-context.md)

The repository README is the start-here page for a new engineer: [../../README.md](../../README.md).

## Self-check

A new engineer can clone, install, and start Demo from the README and [02 Quick start](02-quick-start.md). Architecture, Chat, context, journeys, and dashboards are pages 03, 04, 05, and 08. The API contract and Demo versus Production are pages 06 and 07. Backend gaps are page 14. Security is page 10. Tests, build, and troubleshooting are the README and pages 09 and 11. What may be refactored, and what must not regress, is page 19. Cross-system identity and lineage are the section above. They are specified and not implemented. Product, revision, and effectivity context is [cross-system page 11](cross-system/11-product-part-identity-and-plm-context.md), also specified and not implemented. The decision execution model is [page 21](21-decision-execution-model.md). The maturity model is [page 22](22-manufacturing-ai-maturity-model.md). Governed autonomy, orchestration, and predictive layers on that page are specified and not implemented. If a page and the running RC3 disagree, the running source wins and the page should be corrected in documentation only.
