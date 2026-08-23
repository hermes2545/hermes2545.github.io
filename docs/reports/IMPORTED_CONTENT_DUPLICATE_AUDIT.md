---
title: Imported Content Duplicate Audit
type: report
status: active
visibility: public
created: 2026-08-23
updated: 2026-08-23
sources:
  - https://github.com/hermes2545/hermes-memory
  - https://github.com/hermes2545/hermes-guardian
tags: [library, imported-content, duplicate-audit]
---

# Imported Content Duplicate Audit

## Scope

ตรวจเนื้อหาใหม่สองรายการกับ Reading collection เดิมก่อนเพิ่มเข้าชั้นหนังสือค่ะ

1. `hermes-memory/hermes-memory-kb.html` ค่ะ
2. `hermes-guardian/index.html` ค่ะ

## วิธีตรวจค่ะ

- เปรียบเทียบ SHA256 ของไฟล์ต้นฉบับกับ HTML เดิมทุกเล่มค่ะ
- Extract visible text โดยตัด `script`, `style`, `svg` และ `noscript` ค่ะ
- Normalize Unicode, ตัวพิมพ์ และช่องว่างค่ะ
- เปรียบเทียบ Character 9-gram Jaccard/containment ค่ะ
- เปรียบเทียบหัวข้อ `h1/h2/h3` ค่ะ
- ตรวจความหมายและวัตถุประสงค์ของเอกสารด้วยมนุษย์ค่ะ

## ผลรวมค่ะ

- ไม่พบ SHA256 ซ้ำกับหนังสือเดิมค่ะ
- ไม่พบเอกสารใดที่มี Text containment สูงพอจะถือว่าเป็นสำเนาค่ะ
- ไม่มีรายการใดควรถูกแทนที่หรือรวมกับหนังสือเดิมค่ะ
- เพิ่มเป็นหนังสือใหม่ได้ทั้งสองรายการค่ะ

## Hermes Memory + Self-Improving KB ค่ะ

หัวข้อหลักคือสถาปัตยกรรมความจำหลายชั้นของ Agent, Persistent memory, Session search, Skills, Self-improving Wiki, Raw archive, Automation state และ Knowledge quality control ค่ะ

ผลเทียบที่ใกล้ที่สุดค่ะ

| หนังสือเดิม | Source content ที่พบร่วมกัน |
|---|---:|
| Hermes Mega Prompt | 5.15% |
| Dedicated Library Agent Profile | 2.34% |
| Handoff & Context | 1.92% |
| Personal Infrastructure Wiki | 1.55% |

ความใกล้เคียงเป็นแนวคิดร่วม เช่น Agent, Memory, Wiki และ Runbook แต่โครงสร้าง 7 ชั้นและ Self-improving Knowledge Base เป็นเนื้อหาเฉพาะของเอกสารนี้ค่ะ

**ผล:** `distinct-content` ค่ะ

## Hermes Profile Guardian ค่ะ

หัวข้อหลักคือ Monitor Profile, Triage Profile และ Operator Profile สำหรับตรวจ Scheduled task, Execution evidence, Delivery health, Service/resource signals, Handoff, Stop conditions และ Verified repair ค่ะ

ผลเทียบที่ใกล้ที่สุดค่ะ

| หนังสือเดิม | Source content ที่พบร่วมกัน |
|---|---:|
| Hermes Mega Prompt | 3.91% |
| Network Guardian | 3.33% |
| Dedicated Library Agent Profile | 2.11% |

คำว่า `Guardian` ใกล้กับหนังสือ `Network Guardian` แต่เนื้อหาต่างกันชัดเจนค่ะ

- `Network Guardian` ดูแล Home network, IoT, Homelab และ Incident response ค่ะ
- `Profile Guardian` ดูแลสุขภาพของ Hermes profiles, Cron/execution/delivery และส่งต่อให้ Operator ซ่อมอย่างมีขอบเขตค่ะ

เพื่อไม่ให้ผู้อ่านสับสน Catalog ใช้ชื่อ **ระบบเฝ้าระวังและซ่อม Hermes** และ ID `hermes-profile-guardian` ค่ะ

**ผล:** `distinct-content-name-overlap-only` ค่ะ

## Import decision ค่ะ

Repository ต้นทางแต่ละแห่งมี Commit เดียวและผู้ใช้มีสิทธิ์เข้าถึง Source repository ค่ะ จึงนำเข้า Main Library repository ด้วย `git subtree` แบบรักษา Source commit history โดยไม่ Squash ค่ะ

- `hermes-memory` → `hermes-memory/` ค่ะ
- `hermes-guardian` → `hermes-guardian/` ค่ะ

Repository ต้นทางยังคงอยู่ เพื่อไม่ทำลาย URL เดิมและใช้เป็น Upstream/rollback ได้ค่ะ
