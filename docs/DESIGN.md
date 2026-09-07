# Twingate: It's time to ditch your VPN

## Mission
Create implementation-ready, token-driven UI guidance for Twingate: It's time to ditch your VPN that is optimized for consistency, accessibility, and fast delivery across marketing site.

## Brand
- Product/brand: Twingate: It's time to ditch your VPN
- URL: https://www.twingate.com/
- Audience: developers and technical teams
- Product surface: marketing site

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=TT Hoves Regular`, `font.family.stack=TT Hoves Regular, TT Hoves Regular Placeholder, sans-serif`, `font.size.base=15px`, `font.weight.base=400`, `font.lineHeight.base=22.5px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=13px`, `font.size.md=14px`, `font.size.lg=15px`, `font.size.xl=16px`, `font.size.2xl=17px`, `font.size.3xl=20px`, `font.size.4xl=21px`
- Color palette: `color.text.primary=#ffffff`, `color.text.secondary=#a1a1aa`, `color.text.tertiary=#cfcfd3`, `color.text.inverse=#0e0f11`, `color.surface.base=#000000`
- Spacing scale: `space.1=10px`
- Radius/shadow/motion tokens: No reliable extraction yet; motion and shape tokens should be defined manually.

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (178), inputs (69), lists (12), buttons (2).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
