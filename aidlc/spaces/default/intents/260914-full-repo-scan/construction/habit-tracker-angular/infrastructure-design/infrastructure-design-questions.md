# Infrastructure Design Questions — unit `habit-tracker-angular`

Context: Brownfield **planning-only** intent (FR2). Unit **U2** (`ui`, repo `habit-tracker-angular`). NFR Design (Q1–Q6 all **A**) documented as-built SPA patterns; deploy boundary is **C3** nginx image consumed by U3 Compose.

Sources: U2 `nfr-design/*.md`, `logical-components.md`, `contract-summary.md` (C1 consumer, C3 image), `habit-tracker-angular/Dockerfile`, `nginx.conf`, `habit-tracker-compose/docker-compose.yml`, affirmed `team.md` / `project.md` (Compose prod path).

---

## Q1 — Infrastructure package purpose

What should the U2 infrastructure design artifacts optimize for?

- A. **As-built deploy mapping (recommended)** — document how the **nginx + static SPA** image, CI publish, edge/proxy paths, and U3 Compose wiring map to production; gaps explicit; no new AWS/K8s commitment this intent.
- B. **Target cloud landing zone** — design S3/CloudFront or ECS as normative production even if Compose nginx is current.
- C. **Dual layer** — as-built Compose tables plus a separate AWS migration appendix as committed design.
- D. **CI/CD only** — `cicd-pipeline.md` + traceability; defer deployment tables to U3 Infrastructure Design.
- E. **Minimal closure** — traceability.json only.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Deployment and compute model

How should `infrastructure-specification.md` describe runtime compute for U2?

- A. **Single nginx container on Compose (recommended)** — multi-stage Node 20 build → `nginx:1.27-alpine` serving `dist/browser`; published port 80 on droplet; C3 `:latest` from GitHub Actions; legacy S3/CloudFront workflows out of scope for production story.
- B. **Static hosting on S3 + CloudFront** — treat `deploy-to-aws-s3-with-cloudfront.yml` as primary production design.
- C. **Kubernetes ingress** — Ingress + static asset sidecar as primary design.
- D. **Dev-server in container** — `ng serve` as production pattern.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Edge, API proxy, and shared resources

How should infrastructure services treat nginx, `/api` proxying, and shared stack resources?

- A. **U3 Compose frontend + internal proxy (recommended)** — `frontend` service pulls C3; nginx `location /api/` → `backend:8080`; SPA `try_files` for client routing; TLS/HTTPS documented as operator/nginx extension if not in base compose; shared infra table with U1/U3.
- B. **Split origin** — SPA on CDN, API on separate host; design CORS-first cross-origin production.
- C. **Frontend-only spec** — document image build only; omit U3 networking cross-reference.
- D. **Managed CDN required** — CloudFront as mandatory edge in spec tables.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Monitoring and observability platform

How should `monitoring-design.md` implement observability for the SPA **platform** layer (not in-app RUM)?

- A. **As-built operator model + future checklist (recommended)** — nginx HEALTHCHECK (`wget /`), container stdout logs, manual `docker compose logs frontend`; document absent Web Vitals/Lighthouse CI/RUM; non-binding future rows (edge metrics, synthetic checks).
- B. **Full SRE stack** — Prometheus/Grafana/Loki for nginx and synthetic browser checks as binding design this intent.
- C. **Health only** — single HEALTHCHECK row; defer logging narrative.
- D. **Defer to U3** — all monitoring owned by compose unit only.
- X. Other (please specify)

[Answer]: A

---

## Q5 — CI/CD and promotion

How should `cicd-pipeline.md` describe build, test, and release for U2?

- A. **As-built GitHub Actions + honest gaps (recommended)** — `build-image.yml` on `main` runs `npm ci`, `npm run test:ci`, then docker push C3; reusable `build-and-test.yml` for S3 legacy paths; production pull via U3 manual/workflow; call out legacy S3 workflows and supply-chain backlog (NFR3.18 / BL-SEC-05).
- B. **Normative quality gate** — document Lighthouse/bundle budget gates on `main` as committed design (future state).
- C. **S3/CloudFront primary** — elevate AWS deploy workflows over Docker Hub C3 path.
- D. **No CI narrative** — image build only in prose.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Secrets and environments

How should secrets and environment layout be specified for the SPA unit?

- A. **No runtime secrets in U2 image (recommended)** — JWT and API secrets live on U1/backend `.env`; SPA is static assets only; CI uses `DOCKER_HUB_*` GitHub secrets; dev uses `proxy.conf.json`; document CSP/security headers as nginx backlog (BL-SEC-02).
- B. **Runtime env injection** — design `environment.ts` baked at build via CI secrets for API URLs per environment.
- C. **AWS credentials in SPA repo** — normative S3 deploy secret model for production.
- D. **Skip secrets section** — defer to security-design only.
- X. Other (please specify)

[Answer]: A

---

## Q7 — NFR traceability scope for infrastructure

How should `traceability.json` cover NFR ids at this stage?

- A. **Infrastructure-relevant subset (recommended)** — every U2 NFR row from NFR Design that requires a **container, CI, edge, proxy, or platform observability** decision gets OK, GAP, or N/A with a concrete resource/config target; server-only NFRs stay N/A with pointer to U1/U3.
- B. **Full NFR2.x–NFR7.x repeat** — duplicate entire nfr-design traceability table verbatim.
- C. **Gaps only** — trace backlog NFRs exclusively.
- D. **Empty coverage** — defer traceability to code generation.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U3 (`habit-tracker-compose`) owns stack wiring and published port 80; U2 spec describes the **frontend slice** and C3 contract without changing compose files this intent.
- `build-image.yml` on `main` **does** run `test:ci` before push — contrast with U1 `build-image` test skip (document cross-unit honestly).
- Legacy `deploy-to-aws-s3*.yml` workflows are manual/dispatch-only; Compose C3 is the affirmed production path (align with U1 NFR7.27 / team.md).

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the infrastructure design artifact package?

- **Q1 (A):** As-built deploy mapping to Compose + C3; no new cloud topology.
- **Q2 (A):** Single nginx container; Dockerfile health; port 80 on droplet.
- **Q3 (A):** U3 frontend + `/api/` proxy; shared infra table with U1/U3.
- **Q4 (A):** nginx HEALTHCHECK + compose logs; future RUM/metrics non-binding.
- **Q5 (A):** GitHub Actions as-built; `test:ci` on `main`; legacy S3 documented.
- **Q6 (A):** Static SPA; secrets on U1/droplet; CSP/nginx backlog.
- **Q7 (A):** Infrastructure-relevant NFR traceability only.

- Looks correct
- Request changes

[Answer]: Looks correct
