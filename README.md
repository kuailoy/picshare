# PicShare

A lightweight photo sharing and collaborative selection platform.

PicShare is a personal project exploring a focused scenario:

-Take dozens of photos →
Share them via link →
Let others browse in a visually refined way →
Select favorites →
Download selected results.

Not a cloud drive.
Not a social network.
A focused photo sharing and collaborative selection platform.


## 🏗 Core Design

### Project Focus

PicShare explores the design and architecture of a structured photo sharing workflow.

The emphasis is on:
- Display abstraction
- Collaborative state modeling
- Storage decoupling
- Deployable architecture

### Display First

Photos are presented through modular gallery layouts:

- Grid / Waterfall / Masonry
- Slide / Viewer

The display layer is isolated from:

- Database implementation
- Storage provider
- Authentication logic

It should be portable and reusable.

### Structured Selection

The system models active selection, not passive viewing:
- Mark / favorite
- Rating (planned)
- Shared visibility of selections

### Image Strategy

Clear separation between:

- Preview (web-optimized)
- Original (full resolution)

Design considerations include:

- Performance
- Bandwidth

Replaceable storage providers


## 🚀 Development Phases

### Phase 1 – MVP

- Focus on core sharing loop.
- Upload photos
- Web-optimized preview
- Grid / waterfall / slide view
- Share link (public / password)
- Download
- Mobile save to photos
- Basic invited user login

### Phase 2 – Collaboration

- Roles (admin / user / guest)
- Mark / rate
- Selection visualization
- Filtering

### Phase 3 – Structural Expansion

- Album system
- Project grouping
- Selection export
- Better mobile UX
- Docker-based self-hosted deployment

(These directions are exploratory and may not be implemented.)

##  Use Cases

PicShare aims to support two core use cases:

1. Everyday Sharing

Upload a batch of photos
Generate a shareable link

Allow fast browsing on mobile or desktop
Enable selection and download

2. Photographer + Client Workflow

Upload full shooting session
Client marks / rates preferred photos
Shared visibility of selections
Export selected results

The display layer is designed to also function as:
- A personal portfolio gallery
- reusable photo presentation engine

3. Possible Enterprise Directions (Future Consideration)

Multi-stakeholder collaboration
Selection consensus visualization
Version management (retouched variants)
Approval workflow
Activity logs
---
