var e={categories:[{id:`business`,label:`Business & Communication`,range:`#01–15`},{id:`content`,label:`Content Creation`,range:`#16–30`},{id:`analysis`,label:`Analysis & Research`,range:`#31–45`},{id:`coding`,label:`Coding & Technical`,range:`#46–60`},{id:`writing`,label:`Writing & Editing`,range:`#61–75`},{id:`productivity`,label:`Productivity & Operations`,range:`#76–90`}],prompts:[{id:1,category:`business`,title:`Email Reply — ตอบอีเมลให้กระชับและมืออาชีพ`,description:`ใช้เมื่อได้รับ email ยาวที่ต้องตอบอย่างสุภาพแต่กระชับ ได้ email reply ที่กระชับ ครอบคลุม ไม่เยิ่นเย้อ`,template:`Reply to this email professionally and concisely.
Email: <email>{{email_content}}</email>
My role: {{my_role}}
Key points I want to make: {{key_points}}
Tone: {{tone}}
Length: max 150 words`,vars:[{name:`email_content`,label:`เนื้อหาอีเมลที่ได้รับ`,placeholder:`วางอีเมลที่ได้รับที่นี่`},{name:`my_role`,label:`ตำแหน่ง/บทบาทของคุณ`,placeholder:`เช่น Product Manager`},{name:`key_points`,label:`ประเด็นสำคัญที่ต้องการสื่อ (2-3 ข้อ)`,placeholder:`เช่น ยืนยันวันส่งมอบ, ขอข้อมูลเพิ่มเติม`},{name:`tone`,label:`โทนของการตอบ`,placeholder:`formal/friendly/firm`}],tips:`ได้ email reply ที่กระชับ ครอบคลุม ไม่เยิ่นเย้อ`},{id:2,category:`business`,title:`Meeting Agenda — สร้าง agenda ก่อน meeting`,description:`ใช้เมื่อต้องการ agenda ที่ทำให้ meeting มีประสิทธิภาพ`,template:`Create a meeting agenda for:
Meeting purpose: {{purpose}}
Duration: {{duration}}
Attendees: {{attendees}}
Key decisions needed: {{decisions_needed}}
Format: Time-boxed items with owner`,vars:[{name:`purpose`,label:`จุดประสงค์ของ meeting`,placeholder:`เช่น ตัดสินใจเลือก vendor`},{name:`duration`,label:`ระยะเวลา meeting`,placeholder:`เช่น 30 นาที`},{name:`attendees`,label:`ผู้เข้าร่วม (ตำแหน่ง)`,placeholder:`เช่น หัวหน้าทีม, ฝ่ายจัดซื้อ`},{name:`decisions_needed`,label:`การตัดสินใจที่ต้องได้จาก meeting`,placeholder:`เช่น เลือก vendor ภายในสัปดาห์นี้`}],tips:`Agenda พร้อม time allocation และ owner ทุก item`},{id:3,category:`business`,title:`Meeting Summary — สรุป meeting หลังจบ`,description:`ใช้เมื่อมี transcript หรือ notes และต้องสรุปให้ทีม`,template:`Summarize this meeting. Extract: decisions made,
action items (person + task + deadline),
open questions, next meeting needed?
<notes>{{meeting_notes}}</notes>`,vars:[{name:`meeting_notes`,label:`บันทึกการประชุม`,placeholder:`วาง meeting notes ที่นี่`}],tips:`Summary กระชับพร้อม action items ชัดเจน`},{id:4,category:`business`,title:`Negotiation Brief — เตรียมก่อนเจรจา`,description:`ใช้เมื่อต้องเจรจาราคาหรือ terms กับ client/vendor`,template:`Prepare a negotiation brief.
My goal: {{my_goal}}
Their likely position: {{their_position}}
My BATNA (best alternative): {{batna}}
Concessions I can make: {{concessions}}
Red lines: {{red_lines}}
Provide: opening position, key arguments, concession sequence`,vars:[{name:`my_goal`,label:`สิ่งที่ต้องการบรรลุ`,placeholder:`เช่น ลดราคาลง 10%`},{name:`their_position`,label:`จุดยืนที่คาดว่าอีกฝ่ายต้องการ`,placeholder:`เช่น รักษาราคาปัจจุบันไว้`},{name:`batna`,label:`ทางเลือกสำรองที่ดีที่สุด (BATNA)`,placeholder:`เช่น เปลี่ยนไปใช้ vendor อื่น`},{name:`concessions`,label:`สิ่งที่ยอมผ่อนปรนได้`,placeholder:`เช่น ขยายระยะเวลาสัญญา`},{name:`red_lines`,label:`สิ่งที่ยอมรับไม่ได้เด็ดขาด`,placeholder:`เช่น ราคาเกินงบที่ตั้งไว้`}],tips:`Brief 1 หน้าพร้อม strategy และ talking points`},{id:5,category:`business`,title:`Client Proposal — เขียน proposal ให้ลูกค้า`,description:`ใช้เมื่อต้องส่ง proposal หลัง discovery call`,template:`Write a client proposal.
Client: {{client_info}}
Problem they have: {{problem}}
Our solution: {{solution}}
Price: {{price}}
Timeline: {{timeline}}
Our credentials: {{credentials}}
Include: exec summary, approach, timeline, investment, next steps`,vars:[{name:`client_info`,label:`ชื่อลูกค้า + อุตสาหกรรม`,placeholder:`เช่น บริษัท ABC, ธุรกิจค้าปลีก`},{name:`problem`,label:`ปัญหาที่ลูกค้ามี`,placeholder:`เช่น ระบบสต็อกไม่แม่นยำ`},{name:`solution`,label:`ทางแก้ที่เราเสนอ`,placeholder:`เช่น ระบบจัดการสต็อกอัตโนมัติ`},{name:`price`,label:`ราคา (ช่วงหรือตัวเลขจริง)`,placeholder:`เช่น 200,000-300,000 บาท`},{name:`timeline`,label:`ระยะเวลาโครงการ`,placeholder:`เช่น 3 เดือน`},{name:`credentials`,label:`ผลงานที่ผ่านมาที่เกี่ยวข้อง`,placeholder:`เช่น เคยทำโปรเจกต์คล้ายกันให้บริษัท XYZ`}],tips:`Proposal ที่ convert ได้จริง`},{id:6,category:`business`,title:`Difficult Conversation — คุยเรื่องยากกับ colleague`,description:`ใช้เมื่อต้องพูดเรื่อง performance, conflict หรือ boundary`,template:`Help me prepare for a difficult conversation.
Issue: {{issue}}
My role: {{my_role}}
What I need them to understand: {{key_message}}
Their likely reaction: {{their_reaction}}
Goal: {{goal}}
Provide: opening line, key points, how to handle pushback`,vars:[{name:`issue`,label:`สถานการณ์ที่เกิดขึ้น`,placeholder:`เช่น ทีมส่งงานช้าซ้ำๆ`},{name:`my_role`,label:`บทบาทของคุณ`,placeholder:`manager/peer/report`},{name:`key_message`,label:`สิ่งที่ต้องการให้อีกฝ่ายเข้าใจ`,placeholder:`เช่น deadline ส่งผลต่อทั้งทีม`},{name:`their_reaction`,label:`ปฏิกิริยาที่คาดว่าจะได้รับ`,placeholder:`เช่น อาจรู้สึกถูกตำหนิ`},{name:`goal`,label:`ผลลัพธ์ที่ต้องการ`,placeholder:`เช่น ตกลง action plan ร่วมกัน`}],tips:`Script ที่ respectful และ direct พร้อม contingencies`},{id:7,category:`business`,title:`Status Report — รายงาน progress ให้ management`,description:`ใช้เมื่อต้องส่ง weekly/monthly status ที่ executive อ่านเร็วได้`,template:`Write a status report.
Project: {{project_name}}
Period: {{period}}
Accomplishments: {{accomplishments}}
On track items: {{on_track}}
At risk: {{at_risk}}
Next period focus: {{next_focus}}
Format: RAG status per workstream, max 1 page`,vars:[{name:`project_name`,label:`ชื่อโครงการ`,placeholder:`เช่น ระบบ CRM ใหม่`},{name:`period`,label:`ช่วงเวลารายงาน`,placeholder:`เช่น 1-30 มิ.ย. 2026`},{name:`accomplishments`,label:`สิ่งที่ทำสำเร็จ`,placeholder:`เช่น ปิด phase 1 ตามแผน`},{name:`on_track`,label:`รายการที่เป็นไปตามแผน`,placeholder:`เช่น การพัฒนา backend`},{name:`at_risk`,label:`ปัญหาที่มีความเสี่ยง`,placeholder:`เช่น ทีม QA ขาดคน`},{name:`next_focus`,label:`สิ่งที่จะโฟกัสงวดถัดไป`,placeholder:`เช่น เริ่ม UAT`}],tips:`Status report ที่ executive อ่านใน 2 นาที`},{id:8,category:`business`,title:`Stakeholder Update — update ผู้เกี่ยวข้อง`,description:`ใช้เมื่อต้องแจ้งข้อมูลสำคัญให้ stakeholders หลาย group`,template:`Write a stakeholder update email.
Audience: {{audience}}
News to share: {{news}}
Positive aspects: {{positives}}
Challenges/concerns: {{challenges}}
What you need from them: {{ask}}
Tone: transparent but reassuring`,vars:[{name:`audience`,label:`กลุ่มผู้อ่านและความกังวลของพวกเขา`,placeholder:`เช่น ผู้บริหารที่กังวลเรื่องงบประมาณ`},{name:`news`,label:`ข่าวสารที่จะแจ้ง`,placeholder:`เช่น เลื่อนวันเปิดตัวออกไป 2 สัปดาห์`},{name:`positives`,label:`แง่บวกที่ควรเน้น`,placeholder:`เช่น คุณภาพงานดีขึ้นมาก`},{name:`challenges`,label:`ความท้าทาย/ข้อกังวล`,placeholder:`เช่น ทรัพยากรไม่พอ`},{name:`ask`,label:`สิ่งที่ต้องการจากผู้อ่าน`,placeholder:`เช่น อนุมัติงบเพิ่ม`}],tips:`Email ที่ address concerns ล่วงหน้า`},{id:9,category:`business`,title:`Job Description — เขียน JD ที่ดึงดูด candidate`,description:`ใช้เมื่อต้องหาคนเข้าร่วมทีมและต้องการ JD ที่ดี`,template:`Write a job description for: {{role_title}}
Company context: {{company_context}}
Core responsibilities: {{responsibilities}}
Must-have qualifications: {{must_have}}
Nice-to-have: {{nice_to_have}}
Culture/benefits highlights: {{benefits}}
Include: role overview, responsibilities, qualifications,
what makes this role unique, application instructions`,vars:[{name:`role_title`,label:`ชื่อตำแหน่งงาน`,placeholder:`เช่น Senior Backend Developer`},{name:`company_context`,label:`ข้อมูลบริษัทสั้นๆ`,placeholder:`เช่น สตาร์ทอัพ fintech 50 คน`},{name:`responsibilities`,label:`หน้าที่หลัก (5-7 ข้อ)`,placeholder:`เช่น ออกแบบและดูแลระบบ API`},{name:`must_have`,label:`คุณสมบัติที่ต้องมี`,placeholder:`เช่น ประสบการณ์ 3 ปีขึ้นไปด้าน Python`},{name:`nice_to_have`,label:`คุณสมบัติที่มีแล้วดี`,placeholder:`เช่น เคยใช้ Kubernetes`},{name:`benefits`,label:`จุดเด่นวัฒนธรรม/สวัสดิการ`,placeholder:`เช่น ทำงานยืดหยุ่น, ประกันสุขภาพเต็ม`}],tips:`JD ที่ authentic และ attract ผู้สมัครที่ใช่`},{id:10,category:`business`,title:`Performance Review — เขียน review ที่ constructive`,description:`ใช้เมื่อต้องเขียน performance review สำหรับ team member`,template:`Write a performance review.
Employee: {{employee_role}} | Period: {{period}}
Strengths demonstrated: {{strengths}}
Areas for development: {{development_areas}}
Goals achieved: {{goals_achieved}}
Goals missed + context: {{goals_missed}}
Next period goals: {{next_goals}}
Overall assessment: {{overall_rating}} | Tone: constructive`,vars:[{name:`employee_role`,label:`ตำแหน่งพนักงาน`,placeholder:`เช่น Marketing Executive`},{name:`period`,label:`ช่วงเวลาประเมิน`,placeholder:`เช่น Q1 2026`},{name:`strengths`,label:`จุดแข็งพร้อมตัวอย่าง`,placeholder:`เช่น บริหารแคมเปญได้ตรงเวลาเสมอ`},{name:`development_areas`,label:`จุดที่ควรพัฒนา`,placeholder:`เช่น การนำเสนอต่อผู้บริหาร`},{name:`goals_achieved`,label:`เป้าหมายที่ทำสำเร็จ`,placeholder:`เช่น เพิ่ม lead 20%`},{name:`goals_missed`,label:`เป้าหมายที่พลาด + บริบท`,placeholder:`เช่น พลาดเป้า budget เพราะ vendor delay`},{name:`next_goals`,label:`เป้าหมายงวดถัดไป (3 SMART goals)`,placeholder:`เช่น เพิ่ม conversion rate 15%`},{name:`overall_rating`,label:`คะแนนประเมินโดยรวม (1-5)`,placeholder:`เช่น 4`}],tips:`Review ที่ specific, fair และ forward-looking`},{id:11,category:`business`,title:`Objection Handling — ตอบ objections ลูกค้า`,description:`ใช้เมื่อลูกค้ามี objections ต่อ product/service ที่เสนอ`,template:`Create objection handling responses for my product.
Product/service: {{product}}
Objection 1: {{objection_1}}
Objection 2: {{objection_2}}
Objection 3: {{objection_3}}
For each: acknowledge + reframe + evidence + close`,vars:[{name:`product`,label:`สินค้า/บริการ`,placeholder:`เช่น ซอฟต์แวร์บัญชีออนไลน์`},{name:`objection_1`,label:`ข้อโต้แย้งที่ 1`,placeholder:`เช่น แพงกว่าคู่แข่ง`},{name:`objection_2`,label:`ข้อโต้แย้งที่ 2`,placeholder:`เช่น กังวลเรื่องความปลอดภัยข้อมูล`},{name:`objection_3`,label:`ข้อโต้แย้งที่ 3`,placeholder:`เช่น ทีมไม่มีเวลาเรียนรู้ระบบใหม่`}],tips:`Responses ที่ confident ไม่ defensive`},{id:12,category:`business`,title:`Cold Outreach — ส่งข้อความหา prospect ใหม่`,description:`ใช้เมื่อต้องการ reach out หา leads ที่ไม่เคยติดต่อมาก่อน`,template:`Write a cold outreach message.
Platform: {{platform}}
Recipient: {{recipient}}
My offering: {{offering}}
Specific reason for reaching out: {{hook}}
Ask: {{cta}}
Length: max 80 words. No buzzwords. No 'I hope this finds you well.'`,vars:[{name:`platform`,label:`ช่องทางที่ใช้ส่ง`,placeholder:`LinkedIn/email/other`},{name:`recipient`,label:`ผู้รับ (ตำแหน่ง + บริษัท + บริบท)`,placeholder:`เช่น CTO บริษัท XYZ ที่เพิ่งระดมทุน Series A`},{name:`offering`,label:`สิ่งที่คุณนำเสนอ`,placeholder:`เช่น บริการ cloud security audit`},{name:`hook`,label:`เหตุผลเฉพาะที่ติดต่อ (personalized hook)`,placeholder:`เช่น เห็นบริษัทเพิ่งประกาศขยายทีม`},{name:`cta`,label:`สิ่งที่ต้องการให้ทำ (ask เล็กๆ)`,placeholder:`เช่น ขอเวลา 15 นาทีคุยกัน`}],tips:`Cold message ที่ open rate สูงกว่า generic`},{id:13,category:`business`,title:`Executive Summary — สรุปรายงานสำหรับ C-suite`,description:`ใช้เมื่อมีรายงานยาวและต้องสรุปให้ผู้บริหารอ่านได้เร็ว`,template:`Create an executive summary from this report.
<report>{{report_content}}</report>
Audience: C-suite with limited time
Format: Situation (1 sentence) | Findings (3 bullets)
| Implications (2 bullets) | Recommendation (1 sentence)
Length: max 250 words`,vars:[{name:`report_content`,label:`รายงานหรือส่วนสำคัญของรายงาน`,placeholder:`วางรายงานหรือ key sections ที่นี่`}],tips:`Summary ที่ executive อ่านได้ใน 60 วินาที`},{id:14,category:`business`,title:`Change Communication — แจ้งการเปลี่ยนแปลงองค์กร`,description:`ใช้เมื่อต้องสื่อสาร organizational change ให้ทีมรับได้`,template:`Write a change communication message.
What is changing: {{what_changing}}
Why it's changing: {{reasons}}
Timeline: {{timeline}}
Impact on audience: {{impact}}
What stays the same: {{unchanged}}
What support is available: {{support}}
Tone: transparent, empathetic, forward-looking`,vars:[{name:`what_changing`,label:`สิ่งที่กำลังเปลี่ยนแปลง`,placeholder:`เช่น ปรับโครงสร้างทีม`},{name:`reasons`,label:`เหตุผลที่แท้จริงของการเปลี่ยนแปลง`,placeholder:`เช่น รองรับการเติบโตของบริษัท`},{name:`timeline`,label:`ช่วงเวลาและ milestone`,placeholder:`เช่น เริ่มมีผล 1 ส.ค. 2026`},{name:`impact`,label:`ผลกระทบต่อผู้อ่าน`,placeholder:`เช่น รายงานสายบังคับบัญชาใหม่`},{name:`unchanged`,label:`สิ่งที่ยังคงเดิม (สร้างความอุ่นใจ)`,placeholder:`เช่น เงินเดือนและสวัสดิการไม่เปลี่ยน`},{name:`support`,label:`การสนับสนุนที่มีให้`,placeholder:`เช่น session ถาม-ตอบทุกสัปดาห์`}],tips:`Communication ที่ลด resistance และ build trust`},{id:15,category:`business`,title:`Vendor Evaluation — เปรียบเทียบ vendors`,description:`ใช้เมื่อต้องเลือก vendor และต้องการ structured comparison`,template:`Create a vendor evaluation framework.
What we're buying: {{what_buying}}
Vendors to compare: {{vendors}}
Our top criteria: {{criteria}}
Budget constraint: {{budget}}
Create: scoring matrix, key questions to ask each vendor,
red flags to watch for, recommendation framework`,vars:[{name:`what_buying`,label:`สิ่งที่กำลังจัดซื้อ`,placeholder:`เช่น ระบบ ERP`},{name:`vendors`,label:`รายชื่อ vendor ที่จะเปรียบเทียบ`,placeholder:`เช่น Vendor A, Vendor B, Vendor C`},{name:`criteria`,label:`เกณฑ์สำคัญ (5-7 ข้อ พร้อมน้ำหนัก)`,placeholder:`เช่น ราคา 30%, การซัพพอร์ต 25%`},{name:`budget`,label:`ข้อจำกัดด้านงบประมาณ`,placeholder:`เช่น ไม่เกิน 1 ล้านบาท`}],tips:`Framework ที่ defensible สำหรับ decision makers`},{id:16,category:`content`,title:`LinkedIn Post — เขียน post ที่ reach สูง`,description:`ใช้เมื่อต้องการ LinkedIn post ที่ engage professionals`,template:`Write a LinkedIn post about: {{topic}}
My professional angle: {{angle}}
Target audience: {{audience}}
Format: Story + Insight + Practical takeaway
Length: 200-300 words
End with: 1 question to drive comments
No hashtag spam. No emojis every line.`,vars:[{name:`topic`,label:`หัวข้อโพสต์`,placeholder:`เช่น บทเรียนจากการ launch product ล้มเหลว`},{name:`angle`,label:`มุมมองเฉพาะตัวของคุณ`,placeholder:`เช่น ประสบการณ์ตรงจากการเป็น PM`},{name:`audience`,label:`กลุ่มเป้าหมาย (ตำแหน่ง/อุตสาหกรรม)`,placeholder:`เช่น Product Managers ในสาย tech`}],tips:`Post ที่ sounds human ไม่ใช่ AI-generated`},{id:17,category:`content`,title:`Twitter/X Thread — สร้าง thread ที่คนอยากอ่านต่อ`,description:`ใช้เมื่อต้องการ thread ที่ educate และ entertain`,template:`Write a Twitter thread about: {{topic}}
My unique take: {{unique_take}}
Target audience: {{audience}}
Thread length: {{thread_length}}
Format: Tweet 1 = hook (bold claim/question)
Tweets 2-10 = teaching content
Last tweet = summary + CTA
Max 240 chars per tweet`,vars:[{name:`topic`,label:`หัวข้อ thread`,placeholder:`เช่น วิธีเขียน prompt ให้ได้ผลลัพธ์ดีขึ้น`},{name:`unique_take`,label:`มุมมองที่ทำให้ต่างจากคนอื่น`,placeholder:`เช่น เทคนิคที่ไม่ค่อยมีคนพูดถึง`},{name:`audience`,label:`กลุ่มเป้าหมาย`,placeholder:`เช่น นักการตลาดที่เริ่มใช้ AI`},{name:`thread_length`,label:`จำนวน tweet ใน thread`,placeholder:`เช่น 8-12 tweets`}],tips:`Thread ที่ share ได้และ grow following`},{id:18,category:`content`,title:`YouTube Script — เขียน script วิดีโอ`,description:`ใช้เมื่อต้องการ script ที่ keep viewers watching ตลอด`,template:`Write a YouTube video script about: {{topic}}
Video length: {{video_length}}
Audience: {{audience}}
My style: {{style}}
Structure: Hook (30s) | Intro (1m) | Main content |
Midpoint hook | Conclusion + CTA
Include: B-roll suggestions, screen share moments`,vars:[{name:`topic`,label:`หัวข้อวิดีโอ`,placeholder:`เช่น รีวิวเครื่องมือ AI 5 ตัว`},{name:`video_length`,label:`ความยาววิดีโอ`,placeholder:`เช่น 10 นาที`},{name:`audience`,label:`กลุ่มผู้ชม`,placeholder:`เช่น เจ้าของธุรกิจขนาดเล็ก`},{name:`style`,label:`สไตล์การนำเสนอ`,placeholder:`educational/entertaining/both`}],tips:`Script พร้อม production cues`},{id:19,category:`content`,title:`TikTok Hook — เขียน hook 3 วินาที`,description:`ใช้เมื่อต้องการ opening ที่หยุดคนเลื่อนได้`,template:`Write 10 TikTok hook variations for video about: {{topic}}
Target: {{target}}
Hooks to try: curiosity gap, controversial statement,
relatable problem, surprising stat, direct address
Each hook: max 10 words
Mark top 3 with reasoning`,vars:[{name:`topic`,label:`หัวข้อวิดีโอ`,placeholder:`เช่น เคล็ดลับประหยัดเงิน`},{name:`target`,label:`กลุ่มเป้าหมาย (ช่วงอายุ, ความสนใจ)`,placeholder:`เช่น วัยทำงานอายุ 25-35 สนใจการเงิน`}],tips:`10 hooks หลากสไตล์ เลือกที่ fit กับ brand`},{id:20,category:`content`,title:`Blog Post — เขียน article ที่ rank บน Google`,description:`ใช้เมื่อต้องการ SEO blog post ที่ helpful จริงๆ`,template:`Write a blog post about: {{topic}}
Primary keyword: {{keyword}}
Target reader: {{target_reader}}
Word count: {{word_count}}
Structure: Hook + H2 sections + FAQ + Conclusion
Include: 1 internal link suggestion, 1 stat citation,
5 related keywords to include naturally`,vars:[{name:`topic`,label:`หัวข้อบทความ`,placeholder:`เช่น วิธีเลือกประกันสุขภาพ`},{name:`keyword`,label:`keyword หลัก`,placeholder:`เช่น ประกันสุขภาพ 2026`},{name:`target_reader`,label:`ผู้อ่านเป้าหมาย + search intent`,placeholder:`เช่น มือใหม่ที่กำลังหาข้อมูลก่อนซื้อ`},{name:`word_count`,label:`จำนวนคำ`,placeholder:`800-1500`}],tips:`Article ที่ rank และ read`},{id:21,category:`content`,title:`Newsletter Issue — สร้าง newsletter รายสัปดาห์`,description:`ใช้เมื่อต้องส่ง newsletter ที่คนอยากเปิดทุกอาทิตย์`,template:`Write a newsletter issue for: {{newsletter_name}}
Topic this week: {{topic}}
My unique insight: {{insight}}
Format: Hook (2 lines) | Main insight (200w) |
Quick win (3-5 sentences) | Resource of week | Question
Tone: Smart friend sharing what they learned`,vars:[{name:`newsletter_name`,label:`ชื่อ newsletter`,placeholder:`เช่น Weekly Growth Notes`},{name:`topic`,label:`หัวข้อสัปดาห์นี้`,placeholder:`เช่น เทรนด์การตลาดผ่าน AI`},{name:`insight`,label:`ข้อมูลเชิงลึกที่คุณรู้แต่คนอื่นอาจไม่รู้`,placeholder:`เช่น ผลทดลอง A/B test ล่าสุดของทีม`}],tips:`Newsletter ที่ open rate สูงกว่า 30%`},{id:22,category:`content`,title:`Ad Copy — เขียน ad ที่ convert`,description:`ใช้เมื่อต้องการ ad copy สำหรับ Meta, Google หรือ TikTok`,template:`Write ad copy for: {{product}}
Platform: {{platform}}
Target audience: {{audience}}
CTA: {{cta}}
Budget: {{budget_positioning}}
Provide: 3 variations
Variation A: Problem-aware | B: Solution-aware | C: Social proof`,vars:[{name:`product`,label:`สินค้า/บริการ`,placeholder:`เช่น คอร์สเรียนออนไลน์`},{name:`platform`,label:`แพลตฟอร์มโฆษณา`,placeholder:`Meta/Google/TikTok/Line`},{name:`audience`,label:`กลุ่มเป้าหมาย + pain point`,placeholder:`เช่น พนักงานออฟฟิศที่อยากเปลี่ยนสายงาน`},{name:`cta`,label:`การกระทำที่ต้องการ (CTA)`,placeholder:`เช่น สมัครเรียนวันนี้`},{name:`budget_positioning`,label:`การวางตำแหน่งด้านราคา/งบ`,placeholder:`premium/mid/budget`}],tips:`3 variations ready to A/B test`},{id:23,category:`content`,title:`Product Description — เขียน description ที่ขายได้`,description:`ใช้เมื่อต้องการ product description สำหรับ e-commerce`,template:`Write a product description for: {{product_name}}
Category: {{category}}
Target buyer: {{target_buyer}}
Key features: {{features}}
Price point: {{price}}
Platform: {{platform}}
Include: benefit headline, 3 feature bullets, story paragraph,
SEO-friendly title (60 chars)`,vars:[{name:`product_name`,label:`ชื่อสินค้า`,placeholder:`เช่น เก้าอี้ทำงานเพื่อสุขภาพ`},{name:`category`,label:`หมวดหมู่สินค้า`,placeholder:`เช่น เฟอร์นิเจอร์สำนักงาน`},{name:`target_buyer`,label:`ผู้ซื้อเป้าหมาย`,placeholder:`เช่น คนทำงาน work from home`},{name:`features`,label:`จุดเด่นสินค้า (3-5 ข้อ)`,placeholder:`เช่น ปรับความสูงได้, รองรับหลัง`},{name:`price`,label:`ช่วงราคา`,placeholder:`เช่น 3,500-4,500 บาท`},{name:`platform`,label:`แพลตฟอร์มขาย`,placeholder:`Shopee/Lazada/Website`}],tips:`Description ที่ both discover-able และ convert`},{id:24,category:`content`,title:`Instagram Caption — เขียน caption กับ call to action`,description:`ใช้เมื่อต้องการ caption ที่ match กับ visual content`,template:`Write an Instagram caption.
Photo/video describes: {{visual_description}}
Brand tone: {{brand_tone}}
Target audience: {{audience}}
Goal: {{goal}}
Length: {{length}}
Include: 1 question, relevant hashtag strategy (5-10 tags)`,vars:[{name:`visual_description`,label:`คำอธิบายภาพ/วิดีโอ`,placeholder:`เช่น ภาพเบื้องหลังการถ่ายทำสินค้าใหม่`},{name:`brand_tone`,label:`โทนของแบรนด์ (คำคุณศัพท์)`,placeholder:`เช่น สนุก เป็นกันเอง`},{name:`audience`,label:`กลุ่มเป้าหมาย`,placeholder:`เช่น วัยรุ่นที่ชอบแฟชั่น`},{name:`goal`,label:`เป้าหมายของโพสต์`,placeholder:`awareness/engagement/click to bio`},{name:`length`,label:`ความยาว caption`,placeholder:`short<50w / medium 50-150w / long 150-300w`}],tips:`Caption ที่ complements visual ไม่ซ้ำกัน`},{id:25,category:`content`,title:`Press Release — เขียน press release มาตรฐาน`,description:`ใช้เมื่อมีข่าว announcement ที่ต้องส่งให้สื่อ`,template:`Write a press release.
News: {{news}}
Company: {{company}}
Key spokesperson quote: {{quote}}
Supporting data: {{data}}
Standard format: Headline, Dateline, Lead paragraph,
Body (3-4 paragraphs), Quote, Boilerplate, Contact`,vars:[{name:`news`,label:`ข่าว/ประกาศที่จะแจ้ง`,placeholder:`เช่น เปิดตัวสาขาใหม่`},{name:`company`,label:`ชื่อบริษัท + คำอธิบาย 1 บรรทัด`,placeholder:`เช่น STAG ผู้ให้บริการด้าน AI training`},{name:`quote`,label:`คำพูดจากผู้บริหาร (ให้มาหรือให้ Claude ร่างให้)`,placeholder:`เช่น คำพูดจาก CEO เกี่ยวกับความสำเร็จนี้`},{name:`data`,label:`ข้อมูล/ตัวเลขสนับสนุน`,placeholder:`เช่น ยอดขายเติบโต 40% ในปีที่ผ่านมา`}],tips:`Press release ตาม AP style`},{id:26,category:`content`,title:`FAQ Section — สร้าง FAQ ที่ตอบจริง`,description:`ใช้เมื่อต้องการ FAQ ที่ address concerns ก่อนที่ user จะถาม`,template:`Create a FAQ section for: {{topic}}
Target audience: {{audience}}
Their top concerns: {{concerns}}
Tone: {{tone}}
Write 10 Q&A pairs. Each answer: 2-4 sentences.
Include: practical, pricing, and trust questions`,vars:[{name:`topic`,label:`สินค้า/บริการ/หัวข้อ`,placeholder:`เช่น บริการสมัครสมาชิกฟิตเนส`},{name:`audience`,label:`กลุ่มเป้าหมาย`,placeholder:`เช่น คนที่ไม่เคยออกกำลังกายมาก่อน`},{name:`concerns`,label:`ข้อกังวลหลักของกลุ่มเป้าหมาย`,placeholder:`เช่น กลัวยกเลิกสัญญายาก`},{name:`tone`,label:`โทนการตอบ`,placeholder:`conversational/formal`}],tips:`FAQ ที่ลด support tickets และเพิ่ม conversion`},{id:27,category:`content`,title:`Case Study — เขียน customer success story`,description:`ใช้เมื่อมี client result ที่อยากใช้เป็น social proof`,template:`Write a case study.
Client: {{client_info}}
Challenge they faced: {{challenge}}
Solution we provided: {{solution}}
Results: {{results}}
Timeline: {{timeline}}
Structure: Challenge | Solution | Results | Quote | Learnings
Length: 400-600 words`,vars:[{name:`client_info`,label:`ลูกค้า (อุตสาหกรรม, ขนาด — ไม่ระบุชื่อถ้าเป็นความลับ)`,placeholder:`เช่น บริษัทค้าปลีกขนาดกลาง`},{name:`challenge`,label:`ปัญหาที่ลูกค้าเผชิญ`,placeholder:`เช่น ระบบเก่าทำงานช้าและ error บ่อย`},{name:`solution`,label:`ทางแก้ที่เราให้`,placeholder:`เช่น เปลี่ยนมาใช้ระบบคลาวด์ของเรา`},{name:`results`,label:`ผลลัพธ์ (ตัวเลขที่ชัดเจน)`,placeholder:`เช่น ลดเวลาประมวลผล 60%`},{name:`timeline`,label:`ระยะเวลาที่ใช้`,placeholder:`เช่น 3 เดือน`}],tips:`Case study ที่ conversion-ready`},{id:28,category:`content`,title:`Podcast Show Notes — เขียน show notes + SEO`,description:`ใช้เมื่อมี podcast episode และต้องการ show notes ที่ดี`,template:`Write show notes for this podcast episode.
Episode title: {{episode_title}}
Guest: {{guest}}
Key topics discussed: {{topics}}
Timestamps: {{timestamps}}
Include: 3-sentence summary, key takeaways (5 bullets),
guest bio, episode links, SEO description (155 chars)`,vars:[{name:`episode_title`,label:`ชื่อตอน`,placeholder:`เช่น เจาะลึกกลยุทธ์ระดมทุน`},{name:`guest`,label:`ชื่อแขกรับเชิญ + ความเชี่ยวชาญ`,placeholder:`เช่น คุณสมชาย นักลงทุน VC`},{name:`topics`,label:`หัวข้อที่พูดคุย`,placeholder:`เช่น การเตรียมตัวก่อน pitch นักลงทุน`},{name:`timestamps`,label:`timestamp ของแต่ละช่วง`,placeholder:`ให้มาหรือประมาณให้`}],tips:`Show notes ที่ rank บน Google Podcast search`},{id:29,category:`content`,title:`Email Subject Line — เพิ่ม open rate`,description:`ใช้เมื่อต้องการ subject line ที่คนอยากเปิด`,template:`Write 10 email subject lines for email about: {{topic}}
Audience: {{audience}}
Goal: {{goal}}
Mix of: curiosity / benefit / urgency / personal / number
Max 50 chars each. Mark top 3 for A/B test.`,vars:[{name:`topic`,label:`หัวข้ออีเมล`,placeholder:`เช่น โปรโมชั่นลดราคาสิ้นปี`},{name:`audience`,label:`กลุ่มผู้รับ`,placeholder:`เช่น ลูกค้าเก่าที่ไม่ได้ซื้อ 6 เดือน`},{name:`goal`,label:`สิ่งที่ต้องการให้ทำหลังเปิดอ่าน`,placeholder:`เช่น คลิกไปหน้าโปรโมชั่น`}],tips:`10 options ready to test`},{id:30,category:`content`,title:`Webinar Description — ดึงดูดให้คน register`,description:`ใช้เมื่อจัด webinar และต้องการ landing page copy`,template:`Write a webinar description.
Topic: {{topic}}
Host: {{host}}
Date/time: {{datetime}}
Key takeaways: {{takeaways}}
Who should attend: {{who_should_attend}}
Include: headline, subheadline, 3 problem statements,
3 learning outcomes, speaker bio, FAQ (3 questions)`,vars:[{name:`topic`,label:`หัวข้อ webinar`,placeholder:`เช่น เริ่มต้นลงทุนหุ้นต่างประเทศ`},{name:`host`,label:`ผู้บรรยาย + ความน่าเชื่อถือ`,placeholder:`เช่น คุณสมหญิง นักวางแผนการเงิน CFP`},{name:`datetime`,label:`วันที่และเวลา`,placeholder:`เช่น 20 ก.ค. 2026 19:00 น.`},{name:`takeaways`,label:`สิ่งที่ผู้เข้าร่วมจะได้ (3-5 ข้อ)`,placeholder:`เช่น เข้าใจวิธีเปิดบัญชีลงทุนต่างประเทศ`},{name:`who_should_attend`,label:`กลุ่มที่ควรเข้าร่วม`,placeholder:`เช่น มือใหม่ที่สนใจลงทุนต่างประเทศ`}],tips:`Landing page copy ที่ conversion rate ดี`},{id:31,category:`analysis`,title:`Data Pattern Analysis — วิเคราะห์ข้อมูลหา insights`,description:`ใช้เมื่อมี data และต้องการ insights ที่ actionable`,template:`Analyze this data and find actionable insights.
<data>{{data}}</data>
Context: {{context}}
Key questions: {{key_questions}}
Provide: top 3 patterns, 1 anomaly, 3 recommendations
Format: finding + evidence + so-what per insight`,vars:[{name:`data`,label:`ข้อมูล (วางข้อมูลหรืออธิบาย dataset)`,placeholder:`วางข้อมูลหรืออธิบาย dataset ที่นี่`},{name:`context`,label:`บริบทของข้อมูลนี้`,placeholder:`เช่น ยอดขายรายเดือนของสาขาทั้งหมด`},{name:`key_questions`,label:`คำถามที่ต้องการคำตอบ`,placeholder:`เช่น สาขาไหนมีแนวโน้มลดลง`}],tips:`Insights ที่ business team เข้าใจและใช้งานได้`},{id:32,category:`analysis`,title:`Competitive Analysis — วิเคราะห์คู่แข่ง`,description:`ใช้เมื่อต้องการเข้าใจ competitive landscape ก่อนตัดสินใจ`,template:`Analyze competitors for: {{market}}
Competitors: {{competitors}}
My company: {{my_company}}
Analyze each on: positioning, pricing, strengths,
weaknesses, target customer, key messages
Conclude: gaps in market, our best opportunity,
3 strategic moves to differentiate`,vars:[{name:`market`,label:`สินค้า/บริการ/ตลาด`,placeholder:`เช่น แอปส่งอาหารในกรุงเทพ`},{name:`competitors`,label:`รายชื่อคู่แข่ง (3-5 ราย)`,placeholder:`เช่น คู่แข่ง A, B, C`},{name:`my_company`,label:`คำอธิบายบริษัทของคุณสั้นๆ`,placeholder:`เช่น แอปส่งอาหารเจาะกลุ่มพรีเมียม`}],tips:`Competitive map ที่ strategic`},{id:33,category:`analysis`,title:`SWOT Analysis — วิเคราะห์ก่อนตัดสินใจ`,description:`ใช้เมื่อกำลังพิจารณา strategic decision ที่ต้องการ SWOT`,template:`Create a SWOT analysis for: {{topic}}
Context: {{context}}
Internal info: {{internal_info}}
External info: {{external_info}}
For each quadrant: 5 specific points
Conclude: top 2 strategic priorities based on this SWOT`,vars:[{name:`topic`,label:`หัวข้อ/บริษัท/การตัดสินใจ`,placeholder:`เช่น การขยายธุรกิจไปต่างจังหวัด`},{name:`context`,label:`บริบทของสถานการณ์`,placeholder:`เช่น กำลังพิจารณาเปิดสาขาใหม่`},{name:`internal_info`,label:`ข้อมูลจุดแข็ง/จุดอ่อนที่รู้`,placeholder:`เช่น ทีมงานแข็งแกร่งแต่เงินทุนจำกัด`},{name:`external_info`,label:`บริบทตลาด/อุตสาหกรรม`,placeholder:`เช่น คู่แข่งกำลังขยายตัวเร็ว`}],tips:`SWOT ที่ lead to action ไม่ใช่แค่ list`},{id:34,category:`analysis`,title:`Market Sizing — ประมาณขนาดตลาด`,description:`ใช้เมื่อต้องการ market size estimate สำหรับ pitch หรือ planning`,template:`Estimate the market size for: {{product}}
Geography: {{geography}}
Target customer: {{target_customer}}
Approach: Top-down (TAM/SAM/SOM) and bottom-up
Show assumptions clearly
Provide: best case, base case, conservative case`,vars:[{name:`product`,label:`สินค้า/บริการ`,placeholder:`เช่น แอปบริหารการเงินส่วนบุคคล`},{name:`geography`,label:`ประเทศ/ภูมิภาค`,placeholder:`เช่น ประเทศไทย`},{name:`target_customer`,label:`ลูกค้าเป้าหมาย`,placeholder:`เช่น คนวัยทำงานอายุ 25-40`}],tips:`Market sizing ที่มี assumptions transparent`},{id:35,category:`analysis`,title:`Customer Research Synthesis — สรุป customer feedback`,description:`ใช้เมื่อมี feedback จาก surveys/interviews และต้องสรุป`,template:`Synthesize this customer research.
<feedback>{{feedback}}</feedback>
Research goal: {{research_goal}}
Provide: top 3 themes with evidence quotes,
key pain points ranked by frequency,
unmet needs, surprising findings,
recommended product/service changes`,vars:[{name:`feedback`,label:`คำตอบแบบสำรวจหรือบันทึกสัมภาษณ์`,placeholder:`วาง survey responses หรือ interview notes ที่นี่`},{name:`research_goal`,label:`เป้าหมายของงานวิจัยนี้`,placeholder:`เช่น หาสาเหตุที่ลูกค้ายกเลิกสมาชิก`}],tips:`Synthesis ที่ team นำไปใช้ตัดสินใจได้เลย`},{id:36,category:`analysis`,title:`Financial Analysis — วิเคราะห์ตัวเลขการเงิน`,description:`ใช้เมื่อมี financial data และต้องการ interpretation`,template:`Analyze these financial figures.
<financials>{{financials}}</financials>
Company context: {{company_context}}
Key metrics to analyze: revenue growth, margins, burn rate
Compare to: industry benchmarks if known
Flag: concerning trends, positive indicators,
3 questions management should answer`,vars:[{name:`financials`,label:`ข้อมูลทางการเงิน`,placeholder:`วางข้อมูลการเงินที่นี่`},{name:`company_context`,label:`บริบทบริษัท (อุตสาหกรรม, ขนาด, stage)`,placeholder:`เช่น สตาร์ทอัพ Series A ธุรกิจ SaaS`}],tips:`Analysis ที่ investor หรือ board เข้าใจ`},{id:37,category:`analysis`,title:`Root Cause Analysis — หาต้นเหตุของปัญหา`,description:`ใช้เมื่อเกิดปัญหาซ้ำๆ และต้องการหาสาเหตุที่แท้จริง`,template:`Conduct a root cause analysis for: {{problem}}
Symptoms observed: {{symptoms}}
When it started: {{start_time}}
What changed recently: {{recent_changes}}
Use 5-Whys methodology
Provide: likely root cause(s), contributing factors,
recommended fixes ranked by impact vs effort`,vars:[{name:`problem`,label:`ปัญหาที่เกิดขึ้น`,placeholder:`เช่น อัตราการยกเลิกสมาชิกสูงขึ้น`},{name:`symptoms`,label:`อาการที่สังเกตเห็น`,placeholder:`เช่น ลูกค้ายกเลิกหลังใช้งาน 1 เดือน`},{name:`start_time`,label:`ช่วงเวลาที่เริ่มเกิด`,placeholder:`เช่น เริ่มตั้งแต่เดือนที่แล้ว`},{name:`recent_changes`,label:`สิ่งที่เปลี่ยนแปลงเมื่อเร็วๆ นี้`,placeholder:`เช่น เพิ่งอัปเดตราคาแพ็กเกจ`}],tips:`RCA ที่ fix ปัญหาได้ permanent`},{id:38,category:`analysis`,title:`Survey Design — ออกแบบ survey ที่ได้ข้อมูลดี`,description:`ใช้เมื่อต้องการ survey ที่ได้ข้อมูลที่ใช้ได้จริง`,template:`Design a survey to measure: {{objective}}
Respondents: {{respondents}}
Length: max {{max_minutes}} minutes
Include: screening question, Likert scales,
1-2 open-ended questions
Avoid: leading questions, double-barreled questions
Provide: 10-15 questions with response options`,vars:[{name:`objective`,label:`สิ่งที่ต้องการวัด`,placeholder:`เช่น ความพึงพอใจต่อบริการหลังการขาย`},{name:`respondents`,label:`กลุ่มผู้ตอบแบบสำรวจ`,placeholder:`เช่น ลูกค้าที่ใช้บริการในช่วง 6 เดือนที่ผ่านมา`},{name:`max_minutes`,label:`เวลาสูงสุดที่ใช้ตอบ (นาที)`,placeholder:`เช่น 5`}],tips:`Survey ที่ response rate ดีและ data clean`},{id:39,category:`analysis`,title:`Decision Matrix — เปรียบเทียบตัวเลือก`,description:`ใช้เมื่อต้องตัดสินใจระหว่างหลายทางเลือกอย่าง objective`,template:`Create a decision matrix for: {{decision}}
Options to evaluate: {{options}}
Key criteria: {{criteria}}
Weight each criterion (total = 100%)
Score each option per criterion (1-5)
Show calculation and recommendation
Include: key risks per top option`,vars:[{name:`decision`,label:`การตัดสินใจที่ต้องทำ`,placeholder:`เช่น เลือกแพลตฟอร์ม e-commerce`},{name:`options`,label:`ตัวเลือกที่ต้องประเมิน (3-5)`,placeholder:`เช่น Shopify, WooCommerce, Magento`},{name:`criteria`,label:`เกณฑ์สำคัญ (5-7 ข้อ)`,placeholder:`เช่น ราคา, ความง่ายในการใช้งาน, การรองรับภาษาไทย`}],tips:`Decision matrix ที่ defensible กับ stakeholders`},{id:40,category:`analysis`,title:`Scenario Planning — วางแผนรับมือหลาย scenarios`,description:`ใช้เมื่อต้องการ plan ที่รับมือได้กับ future uncertainty`,template:`Create scenario plans for: {{situation}}
Timeframe: {{timeframe}}
Key uncertainties: {{uncertainties}}
Create 3 scenarios: Optimistic | Base | Pessimistic
For each: probability, key assumptions,
strategic response, early warning signs`,vars:[{name:`situation`,label:`สถานการณ์ที่วางแผนรับมือ`,placeholder:`เช่น การขยายตลาดไปต่างประเทศ`},{name:`timeframe`,label:`ช่วงเวลาการวางแผน`,placeholder:`เช่น 12 เดือนข้างหน้า`},{name:`uncertainties`,label:`ความไม่แน่นอนหลัก (2-3 ข้อ)`,placeholder:`เช่น อัตราแลกเปลี่ยน, กฎหมายท้องถิ่น`}],tips:`Scenarios ที่ trigger-based ไม่ใช่แค่ story`},{id:41,category:`analysis`,title:`Literature Review — สรุปงานวิจัย`,description:`ใช้เมื่อต้องการ synthesis ของ research papers หลายชิ้น`,template:`Synthesize these research findings.
<papers>{{papers}}</papers>
Research question: {{research_question}}
Provide: consensus findings, contradictions,
methodological limitations, gaps in literature,
implications for {{context}}
Format: narrative synthesis, not just summary`,vars:[{name:`papers`,label:`บทคัดย่อหรือส่วนสำคัญของงานวิจัย`,placeholder:`วาง abstracts หรือ key sections ที่นี่`},{name:`research_question`,label:`คำถามวิจัยที่ต้องการคำตอบ`,placeholder:`เช่น ปัจจัยใดมีผลต่อ employee retention`},{name:`context`,label:`บริบทที่จะนำผลไปใช้`,placeholder:`เช่น องค์กรขนาดกลางในไทย`}],tips:`Literature review ที่ advance ความเข้าใจ`},{id:42,category:`analysis`,title:`Trend Analysis — วิเคราะห์ trend ในอุตสาหกรรม`,description:`ใช้เมื่อต้องการเข้าใจ trends ที่จะกระทบ business`,template:`Analyze trends affecting: {{industry}}
Timeframe: {{timeframe}}
My company: {{my_company}}
Provide: 5 macro trends, impact assessment per trend,
opportunities created, threats to prepare for,
3 strategic recommendations`,vars:[{name:`industry`,label:`อุตสาหกรรม/ภาคธุรกิจ`,placeholder:`เช่น ธุรกิจค้าปลีก`},{name:`timeframe`,label:`ช่วงเวลาที่วิเคราะห์`,placeholder:`เช่น 2-5 ปีข้างหน้า`},{name:`my_company`,label:`บริบทบริษัทของคุณสั้นๆ`,placeholder:`เช่น ร้านค้าปลีกขนาดกลาง 20 สาขา`}],tips:`Trend analysis ที่ actionable`},{id:43,category:`analysis`,title:`Risk Assessment — ประเมินความเสี่ยง`,description:`ใช้เมื่อต้องการ risk assessment ก่อน launch หรือ decision`,template:`Create a risk assessment for: {{project}}
Scope: {{scope}}
Stakeholders: {{stakeholders}}
For each risk: description, likelihood (1-5),
impact (1-5), risk score, owner, mitigation action
Identify top 5 risks to prioritize`,vars:[{name:`project`,label:`โครงการ/การตัดสินใจ`,placeholder:`เช่น เปิดตัวสินค้าใหม่`},{name:`scope`,label:`ขอบเขตที่ต้องการประเมิน`,placeholder:`เช่น การผลิตและจัดจำหน่าย`},{name:`stakeholders`,label:`ผู้ที่ได้รับผลกระทบ`,placeholder:`เช่น ทีมผลิต, ทีมขาย, ลูกค้า`}],tips:`Risk register ที่ actionable`},{id:44,category:`analysis`,title:`Customer Journey Map — map ประสบการณ์ลูกค้า`,description:`ใช้เมื่อต้องการเข้าใจ touchpoints ในการ journey ของ customer`,template:`Create a customer journey map.
Customer persona: {{persona}}
Journey stage: {{journey_stage}}
For each stage: touchpoints, customer goal,
emotion (frustrated/neutral/delighted),
our actions, improvement opportunities`,vars:[{name:`persona`,label:`persona ของลูกค้า`,placeholder:`เช่น มนุษย์เงินเดือนอายุ 30 ที่เพิ่งเริ่มลงทุน`},{name:`journey_stage`,label:`ช่วงของ journey (ตั้งแต่ awareness ถึง retention)`,placeholder:`เช่น awareness ถึง purchase`}],tips:`Journey map ที่ highlight moments of truth`},{id:45,category:`analysis`,title:`A/B Test Analysis — วิเคราะห์ผล experiment`,description:`ใช้เมื่อทำ A/B test เสร็จแล้วและต้องการ interpretation`,template:`Analyze this A/B test result.
Hypothesis: {{hypothesis}}
Variant A: {{variant_a}} | Variant B: {{variant_b}}
Results: {{results}}
Provide: statistical significance assessment,
practical significance, recommendation,
follow-up tests to consider`,vars:[{name:`hypothesis`,label:`สมมติฐานที่ทดสอบ`,placeholder:`เช่น ปุ่มสีแดงจะเพิ่ม conversion`},{name:`variant_a`,label:`Variant A (control)`,placeholder:`เช่น ปุ่มสีน้ำเงินเดิม`},{name:`variant_b`,label:`Variant B (test)`,placeholder:`เช่น ปุ่มสีแดงใหม่`},{name:`results`,label:`ผลลัพธ์ (conversion rate, sample size, ระยะเวลา)`,placeholder:`เช่น A 3.2% vs B 3.8%, n=10,000, 2 สัปดาห์`}],tips:`Analysis ที่ confident กับ decision`},{id:46,category:`coding`,title:`Function Generator — เขียน function ที่สมบูรณ์`,description:`ใช้เมื่อต้องการ function พร้อม type hints, docstring และ tests`,template:`Write a Python function that: {{function_purpose}}
Input: {{input_description}}
Output: {{output_description}}
Edge cases to handle: {{edge_cases}}
Include: type hints, Google-style docstring,
3 unit tests (happy path, edge case, error case)`,vars:[{name:`function_purpose`,label:`สิ่งที่ function ควรทำ`,placeholder:`เช่น ตรวจสอบความถูกต้องของเลขบัตรประชาชน`},{name:`input_description`,label:`คำอธิบาย parameters และ types`,placeholder:`เช่น string เลข 13 หลัก`},{name:`output_description`,label:`คำอธิบายค่าที่ return และ type`,placeholder:`เช่น boolean ว่าถูกต้องหรือไม่`},{name:`edge_cases`,label:`edge cases ที่ต้องจัดการ`,placeholder:`เช่น ค่าว่าง, ตัวอักษรปนตัวเลข`}],tips:`Production-ready function ที่ทำงานได้`},{id:47,category:`coding`,title:`Code Review — review code อย่าง systematic`,description:`ใช้เมื่อต้องการ thorough code review ก่อน merge`,template:`Review this code systematically.
<code>{{code}}</code>
Language: {{language}} | Context: {{context}}
Review for: bugs (must fix), security (must fix),
performance (should fix), readability (nice to fix)
For each issue: line number + problem + suggested fix`,vars:[{name:`code`,label:`โค้ดที่ต้องการ review`,placeholder:`วางโค้ดที่นี่`},{name:`language`,label:`ภาษาโปรแกรม`,placeholder:`เช่น Python`},{name:`context`,label:`บริบทว่าโค้ดนี้ทำอะไร`,placeholder:`เช่น ฟังก์ชันประมวลผล payment`}],tips:`Review ที่ prioritized และ actionable`},{id:48,category:`coding`,title:`Bug Diagnosis — หา root cause ของ bug`,description:`ใช้เมื่อมี bug ที่ reproduce ได้และต้องการ diagnosis`,template:`Help me diagnose this bug.
Code: <code>{{code}}</code>
Error message: {{error_message}}
Expected behavior: {{expected_behavior}}
Actual behavior: {{actual_behavior}}
What I've tried: {{attempts}}
Provide: likely root cause, fix, how to test the fix`,vars:[{name:`code`,label:`โค้ดที่เกี่ยวข้อง`,placeholder:`วางโค้ดที่นี่`},{name:`error_message`,label:`ข้อความ error`,placeholder:`วาง error message ที่นี่`},{name:`expected_behavior`,label:`พฤติกรรมที่ควรจะเป็น`,placeholder:`เช่น ควร return ค่าที่ถูกต้อง`},{name:`actual_behavior`,label:`พฤติกรรมที่เกิดขึ้นจริง`,placeholder:`เช่น return None แทน`},{name:`attempts`,label:`สิ่งที่ลองแก้ไปแล้ว`,placeholder:`เช่น เพิ่ม try-except แล้วแต่ยังไม่หาย`}],tips:`Diagnosis พร้อม fix ที่ verified`},{id:49,category:`coding`,title:`SQL Query — เขียน query ที่ efficient`,description:`ใช้เมื่อต้องการ SQL query สำหรับ data analysis`,template:`Write a SQL query for: {{data_need}}
Database: {{database}}
Tables available: {{tables}}
Filters needed: {{filters}}
Output format: {{output_format}}
Include: comments explaining complex joins,
performance notes if relevant`,vars:[{name:`data_need`,label:`ข้อมูลที่ต้องการดึง`,placeholder:`เช่น ยอดขายรวมต่อสาขาต่อเดือน`},{name:`database`,label:`ชนิดฐานข้อมูล`,placeholder:`PostgreSQL/MySQL/BigQuery/etc.`},{name:`tables`,label:`ตารางที่มี พร้อมคอลัมน์สำคัญ`,placeholder:`เช่น orders(id, branch_id, amount, date)`},{name:`filters`,label:`เงื่อนไขการกรอง`,placeholder:`เช่น เฉพาะปี 2026`},{name:`output_format`,label:`รูปแบบผลลัพธ์ (คอลัมน์, aggregation, การเรียง)`,placeholder:`เช่น เรียงตามยอดขายมากไปน้อย`}],tips:`Query ที่ correct และ optimized`},{id:50,category:`coding`,title:`API Design — ออกแบบ REST API`,description:`ใช้เมื่อต้องการ design API สำหรับ new service`,template:`Design a REST API for: {{service}}
Core entities: {{entities}}
Key operations: {{operations}}
Auth requirements: {{auth_requirements}}
Provide: endpoint list with methods,
request/response schemas for each,
error codes and messages, versioning strategy`,vars:[{name:`service`,label:`ชื่อและจุดประสงค์ของ service`,placeholder:`เช่น ระบบจองห้องประชุม`},{name:`entities`,label:`entity หลัก`,placeholder:`เช่น Room, Booking, User`},{name:`operations`,label:`การทำงานหลัก (CRUD + พิเศษ)`,placeholder:`เช่น สร้าง/ยกเลิกการจอง, เช็คห้องว่าง`},{name:`auth_requirements`,label:`ข้อกำหนดด้าน authentication`,placeholder:`เช่น JWT-based auth`}],tips:`API design ที่ follow REST best practices`},{id:51,category:`coding`,title:`Regex Pattern — เขียน pattern ที่ match ถูกต้อง`,description:`ใช้เมื่อต้องการ regex สำหรับ validation หรือ extraction`,template:`Write a regex pattern for: {{match_description}}
Examples that SHOULD match: {{should_match}}
Examples that should NOT match: {{should_not_match}}
Language: {{language}}
Include: the pattern, explanation of each part,
Python code snippet to use it`,vars:[{name:`match_description`,label:`สิ่งที่ต้องการ match`,placeholder:`เช่น เบอร์โทรศัพท์ไทย`},{name:`should_match`,label:`ตัวอย่างที่ควร match`,placeholder:`เช่น 0812345678, 081-234-5678`},{name:`should_not_match`,label:`ตัวอย่างที่ไม่ควร match`,placeholder:`เช่น 123, abcdefg`},{name:`language`,label:`ภาษาโปรแกรม`,placeholder:`Python/JavaScript/PHP/etc.`}],tips:`Regex ที่ tested กับ examples`},{id:52,category:`coding`,title:`Database Schema — ออกแบบ schema`,description:`ใช้เมื่อต้องการ database design สำหรับ new application`,template:`Design a database schema for: {{application}}
Core features: {{features}}
Expected data volume: {{data_volume}}
Database: {{database}}
Create: tables/collections with columns/fields,
data types, constraints, indexes,
explain normalization decisions`,vars:[{name:`application`,label:`แอปพลิเคชัน`,placeholder:`เช่น ระบบจัดการร้านกาแฟ`},{name:`features`,label:`ฟีเจอร์หลัก`,placeholder:`เช่น สั่งอาหาร, จัดการสต็อก, สะสมแต้ม`},{name:`data_volume`,label:`ปริมาณข้อมูลโดยประมาณ`,placeholder:`เช่น 10,000 order ต่อเดือน`},{name:`database`,label:`ชนิดฐานข้อมูล`,placeholder:`PostgreSQL/MySQL/MongoDB/etc.`}],tips:`Schema ที่ scalable และ normalized`},{id:53,category:`coding`,title:`Error Handling — เพิ่ม error handling ที่ robust`,description:`ใช้เมื่อมี code ที่ยังไม่มี proper error handling`,template:`Add robust error handling to this code.
<code>{{code}}</code>
Context: {{context}}
Expected error types: {{error_types}}
Add: specific exception handling, logging,
user-friendly error messages, retry logic if appropriate
Show before and after`,vars:[{name:`code`,label:`โค้ดที่ต้องการเพิ่ม error handling`,placeholder:`วางโค้ดที่นี่`},{name:`context`,label:`บริบทว่าโค้ดนี้ทำอะไร รันที่ไหน`,placeholder:`เช่น ฟังก์ชันเรียก external API`},{name:`error_types`,label:`ประเภท error ที่คาดว่าจะเจอ`,placeholder:`เช่น network timeout, invalid response`}],tips:`Code ที่ handle failures gracefully`},{id:54,category:`coding`,title:`Refactor — ปรับ code structure ให้ดีขึ้น`,description:`ใช้เมื่อมี legacy code ที่ works แต่ maintain ยาก`,template:`Refactor this code for better maintainability.
<code>{{code}}</code>
Issues to address: {{issues}}
Constraints: {{constraints}}
Show: original, refactored, and what changed + why`,vars:[{name:`code`,label:`โค้ดที่ต้องการ refactor`,placeholder:`วางโค้ดที่นี่`},{name:`issues`,label:`ปัญหาที่ต้องแก้`,placeholder:`เช่น God function, ชื่อตัวแปรไม่สื่อความหมาย`},{name:`constraints`,label:`ข้อจำกัด`,placeholder:`เช่น ต้อง backward compatible, ห้ามเพิ่ม dependency ใหม่`}],tips:`Refactored code พร้อม explanation`},{id:55,category:`coding`,title:`Test Cases — เขียน test coverage`,description:`ใช้เมื่อต้องการ test suite ที่ครอบคลุม edge cases`,template:`Write comprehensive tests for this function.
<code>{{code}}</code>
Test framework: {{test_framework}}
Include: happy path, boundary values, error cases,
type mismatches if relevant
Each test: descriptive name + arrange-act-assert`,vars:[{name:`code`,label:`function ที่ต้องการเขียน test`,placeholder:`วางโค้ดที่นี่`},{name:`test_framework`,label:`test framework ที่ใช้`,placeholder:`pytest/jest/mocha/etc.`}],tips:`Test suite ที่ catch real bugs`},{id:56,category:`coding`,title:`README Documentation — เขียน README ที่ชัดเจน`,description:`ใช้เมื่อมี project ที่ต้องการ documentation ที่ดี`,template:`Write a README for this project.
Project: {{project}}
Tech stack: {{tech_stack}}
Sections: Overview, Prerequisites, Installation,
Configuration, Usage (with examples), API Reference,
Contributing, License
Tone: developer-friendly, concise`,vars:[{name:`project`,label:`ชื่อโปรเจกต์ + คำอธิบาย 1 บรรทัด`,placeholder:`เช่น task-tracker: เครื่องมือจัดการงานแบบ CLI`},{name:`tech_stack`,label:`เทคโนโลยีที่ใช้`,placeholder:`เช่น Node.js, Express, PostgreSQL`}],tips:`README ที่ onboard developer ได้เร็ว`},{id:57,category:`coding`,title:`Performance Optimization — หา bottleneck`,description:`ใช้เมื่อมี code ที่ช้าและต้องการ optimize`,template:`Identify performance bottlenecks in this code.
<code>{{code}}</code>
Current performance: {{current_performance}}
Language/runtime: {{runtime}}
Provide: bottlenecks ranked by impact,
optimization suggestions with trade-offs,
what to benchmark to verify improvement`,vars:[{name:`code`,label:`โค้ดที่ทำงานช้า`,placeholder:`วางโค้ดที่นี่`},{name:`current_performance`,label:`คำอธิบายปัญหาปัจจุบัน`,placeholder:`เช่น ใช้เวลาประมวลผล 5 วินาทีต่อ request`},{name:`runtime`,label:`ภาษา/runtime ที่ใช้`,placeholder:`เช่น Node.js 20`}],tips:`Analysis พร้อม concrete optimizations`},{id:58,category:`coding`,title:`System Design — วาง architecture สำหรับ system`,description:`ใช้เมื่อต้องการ high-level design สำหรับ new system`,template:`Design a system for: {{system_description}}
Scale requirements: {{scale_requirements}}
Non-functional requirements: {{nfr}}
Provide: component diagram (text format),
tech choices with rationale,
data flow, failure modes + mitigations,
what to defer to v2`,vars:[{name:`system_description`,label:`คำอธิบายระบบ`,placeholder:`เช่น ระบบแจ้งเตือนแบบ real-time`},{name:`scale_requirements`,label:`ความต้องการด้าน scale (ผู้ใช้, requests/sec, data volume)`,placeholder:`เช่น 1 ล้านผู้ใช้, 500 req/sec`},{name:`nfr`,label:`non-functional requirements (availability, latency ฯลฯ)`,placeholder:`เช่น uptime 99.9%, latency < 200ms`}],tips:`Design ที่ pragmatic และ scalable`},{id:59,category:`coding`,title:`Code Translation — แปลง code ระหว่าง languages`,description:`ใช้เมื่อต้องการ port code จาก language หนึ่งไปอีก language`,template:`Translate this code from {{source_language}} to {{target_language}}.
<code>{{code}}</code>
Preserve: logic, behavior, error handling
Apply: idiomatic patterns of the target language
Note: any behaviors that differ between languages`,vars:[{name:`source_language`,label:`ภาษาต้นทาง`,placeholder:`เช่น Python`},{name:`target_language`,label:`ภาษาปลายทาง`,placeholder:`เช่น Go`},{name:`code`,label:`โค้ดต้นฉบับ`,placeholder:`วางโค้ดที่นี่`}],tips:`Translation ที่ idiomatic ไม่ใช่ literal`},{id:60,category:`coding`,title:`Cron Job / Scheduler — เขียน scheduled task`,description:`ใช้เมื่อต้องการ task ที่รันอัตโนมัติตามเวลา`,template:`Write a scheduled task that: {{task_description}}
Schedule: {{schedule}}
Language/platform: {{platform}}
Include: error handling, logging, retry on failure,
notification on success/failure, idempotency`,vars:[{name:`task_description`,label:`สิ่งที่ task ต้องทำ`,placeholder:`เช่น ดึงข้อมูลยอดขายรายวันไปเก็บใน database`},{name:`schedule`,label:`ตารางเวลา (cron expression หรือคำอธิบาย)`,placeholder:`เช่น ทุกวันเวลา 01:00 น.`},{name:`platform`,label:`ภาษา/แพลตฟอร์ม`,placeholder:`Python/Node/etc.`}],tips:`Scheduled task ที่ production-ready`},{id:61,category:`writing`,title:`Clarity Edit — ทำให้ประโยคชัดขึ้น`,description:`ใช้เมื่อมี text ที่ complex และต้องการให้อ่านง่ายขึ้น`,template:`Edit this text for clarity and conciseness.
<text>{{text}}</text>
Target: cut 20%, improve clarity
Rules: shorter sentences (max 20 words avg),
active voice, concrete over abstract,
remove jargon unless necessary
Show: original → edited with change rationale`,vars:[{name:`text`,label:`ข้อความที่ต้องการแก้ไข`,placeholder:`วางข้อความที่นี่`}],tips:`Text ที่ชัดขึ้นและสั้นลง 20%`},{id:62,category:`writing`,title:`Tone Adjustment — ปรับ tone ให้เหมาะกับ audience`,description:`ใช้เมื่อมี text ที่ tone ไม่ตรงกับ audience`,template:`Adjust the tone of this text.
<text>{{text}}</text>
Current tone: {{current_tone}}
Target tone: {{target_tone}}
Audience: {{audience}}
Preserve: the core message and all facts
Change: vocabulary, sentence structure, examples`,vars:[{name:`text`,label:`ข้อความต้นฉบับ`,placeholder:`วางข้อความที่นี่`},{name:`current_tone`,label:`โทนปัจจุบัน`,placeholder:`เช่น เป็นทางการเกินไป`},{name:`target_tone`,label:`โทนที่ต้องการ`,placeholder:`formal/casual/empathetic/authoritative`},{name:`audience`,label:`กลุ่มผู้อ่านเป้าหมาย`,placeholder:`เช่น ลูกค้าทั่วไปที่ไม่ใช่ผู้เชี่ยวชาญ`}],tips:`Same content, different vibe`},{id:63,category:`writing`,title:`Plain Language — แปลง jargon เป็นภาษาที่เข้าใจง่าย`,description:`ใช้เมื่อมี technical text ที่ต้องทำให้คนทั่วไปอ่านได้`,template:`Rewrite this in plain language.
<text>{{text}}</text>
Original audience: {{original_audience}}
New audience: {{new_audience}}
Keep: accuracy and all key information
Replace: jargon with simple words
Add: analogies where helpful`,vars:[{name:`text`,label:`ข้อความเชิงเทคนิคต้นฉบับ`,placeholder:`วางข้อความที่นี่`},{name:`original_audience`,label:`กลุ่มผู้อ่านเดิม`,placeholder:`ผู้เชี่ยวชาญ`},{name:`new_audience`,label:`กลุ่มผู้อ่านใหม่`,placeholder:`general public / ระดับอ่านง่ายชั้น ม.2`}],tips:`Text ที่ reading level ลดลงโดยไม่เสียความหมาย`},{id:64,category:`writing`,title:`Grammar & Style — แก้ grammatical errors`,description:`ใช้เมื่อมี text ที่ต้องการ proofreading ครั้งสุดท้าย`,template:`Proofread and correct this text.
<text>{{text}}</text>
Style guide: {{style_guide}}
Fix: grammar, punctuation, spelling
Flag: style inconsistencies, awkward phrasing
Show corrections in [BRACKETS] or as tracked changes`,vars:[{name:`text`,label:`ข้อความที่ต้องการตรวจ`,placeholder:`วางข้อความที่นี่`},{name:`style_guide`,label:`style guide ที่ใช้ (ถ้ามี)`,placeholder:`AP/Chicago/Oxford/company style หรือไม่มี`}],tips:`Error-free text พร้อม submit`},{id:65,category:`writing`,title:`Summarization — สรุปให้สั้นและครบ`,description:`ใช้เมื่อมี document ยาวและต้องการ summary หลายระดับ`,template:`Summarize this document.
<document>{{document}}</document>
Audience: {{audience}}
Create 3 versions: 1-sentence, 3-sentence, 1-paragraph
Each must: capture the main argument,
not add new information,
use simpler language than original`,vars:[{name:`document`,label:`เอกสารที่ต้องการสรุป`,placeholder:`วางเอกสารที่นี่`},{name:`audience`,label:`ผู้ที่จะอ่านสรุปนี้`,placeholder:`เช่น ทีมผู้บริหาร`}],tips:`3 summaries เลือกใช้ตาม context`},{id:66,category:`writing`,title:`Expand — ขยาย outline เป็น full text`,description:`ใช้เมื่อมี bullet points และต้องการ full paragraphs`,template:`Expand these bullet points into full prose.
<bullets>{{bullets}}</bullets>
Target length: {{target_length}}
Tone: {{tone}}
Add: smooth transitions, supporting examples,
topic sentences per paragraph
Don't: add new facts not in bullets`,vars:[{name:`bullets`,label:`bullet points ต้นฉบับ`,placeholder:`วาง bullet points ที่นี่`},{name:`target_length`,label:`ความยาวที่ต้องการ`,placeholder:`เช่น 500 คำ`},{name:`tone`,label:`โทนของงานเขียน`,placeholder:`เช่น เป็นกันเองแต่มืออาชีพ`}],tips:`Full text ที่ flows naturally`},{id:67,category:`writing`,title:`Passive to Active — เปลี่ยน passive เป็น active`,description:`ใช้เมื่อมี text ที่ passive voice ทำให้อ่านยาก`,template:`Convert passive voice to active in this text.
<text>{{text}}</text>
Identify: all passive constructions
Convert: to active where it improves clarity
Keep passive: when active would be awkward
Show: list of changes made`,vars:[{name:`text`,label:`ข้อความต้นฉบับ`,placeholder:`วางข้อความที่นี่`}],tips:`Text ที่ direct และ vivid กว่าเดิม`},{id:68,category:`writing`,title:`Thai-English Translation — แปลคุณภาพสูง`,description:`ใช้เมื่อต้องการ translation ที่ natural ไม่ใช่ word-for-word`,template:`Translate this from {{source_lang}} to {{target_lang}}.
<source>{{source_text}}</source>
Audience: {{audience}}
Tone: {{tone}}
Preserve: tone, cultural nuances, technical terms
Note: terms I want kept in original language: {{keep_terms}}`,vars:[{name:`source_lang`,label:`ภาษาต้นทาง`,placeholder:`Thai/English`},{name:`target_lang`,label:`ภาษาปลายทาง`,placeholder:`English/Thai`},{name:`source_text`,label:`ข้อความต้นฉบับ`,placeholder:`วางข้อความที่นี่`},{name:`audience`,label:`กลุ่มผู้อ่าน`,placeholder:`เช่น ลูกค้าต่างชาติ`},{name:`tone`,label:`โทนของงานแปล`,placeholder:`formal/casual/technical`},{name:`keep_terms`,label:`คำที่ต้องการคงไว้ในภาษาเดิม`,placeholder:`เช่น ชื่อผลิตภัณฑ์, ชื่อแบรนด์`}],tips:`Translation ที่ native speakers ยอมรับ`},{id:69,category:`writing`,title:`Paraphrase — เขียนใหม่โดยไม่ lose meaning`,description:`ใช้เมื่อต้องการ paraphrase เพื่อหลีกเลี่ยง plagiarism หรือ repetition`,template:`Paraphrase this text.
<text>{{text}}</text>
Change: sentence structure, vocabulary, organization
Keep: all facts and arguments
Level: {{level}}`,vars:[{name:`text`,label:`ข้อความต้นฉบับ`,placeholder:`วางข้อความที่นี่`},{name:`level`,label:`ระดับการเขียนใหม่`,placeholder:`light / medium / complete rewrite`}],tips:`Text ที่ different surface, same substance`},{id:70,category:`writing`,title:`Headline/Title Optimization — เพิ่ม click-through`,description:`ใช้เมื่อต้องการ title ที่คนอยากคลิก`,template:`Write 10 headline variations for: {{content_topic}}
Audience: {{audience}}
Goal: {{goal}}
Mix styles: how-to, list, question, provocative, benefit
Max 60 chars each. Mark top 3 for testing.`,vars:[{name:`content_topic`,label:`หัวข้อ/บทความ/เนื้อหา`,placeholder:`เช่น บทความสอนลงทุน ETF`},{name:`audience`,label:`กลุ่มผู้อ่านเป้าหมาย`,placeholder:`เช่น มือใหม่หัดลงทุน`},{name:`goal`,label:`เป้าหมายของหัวข้อ`,placeholder:`inform/persuade/entertain`}],tips:`10 headlines ready for A/B test`},{id:71,category:`writing`,title:`Speech Writing — เขียน speech สำหรับงาน`,description:`ใช้เมื่อต้องกล่าว speech ในงาน event สำคัญ`,template:`Write a speech for: {{occasion}}
Speaker: {{speaker_role}}
Audience: {{audience}}
Key message: {{key_message}}
Duration: {{duration}}
Include: opening hook, 3 main points, personal story,
memorable closing, no filler phrases`,vars:[{name:`occasion`,label:`โอกาส/งานที่จะกล่าวสุนทรพจน์`,placeholder:`เช่น งานเลี้ยงส่งท้ายปี`},{name:`speaker_role`,label:`บทบาทของผู้พูด`,placeholder:`เช่น CEO`},{name:`audience`,label:`ผู้ฟัง`,placeholder:`เช่น พนักงานทั้งบริษัท`},{name:`key_message`,label:`สารสำคัญ (1 ประโยค)`,placeholder:`เช่น ขอบคุณทีมงานสำหรับปีที่ผ่านมา`},{name:`duration`,label:`ระยะเวลาพูด`,placeholder:`เช่น 5 นาที`}],tips:`Speech ที่ delivered ได้ naturally`},{id:72,category:`writing`,title:`Academic Abstract — เขียน abstract งานวิจัย`,description:`ใช้เมื่อมี research paper และต้องการ abstract มาตรฐาน`,template:`Write an academic abstract for this paper.
<paper>{{paper_content}}</paper>
Journal target: {{journal_field}}
Word limit: {{word_limit}}
Structure: Background, Objective, Methods,
Results, Conclusion, Keywords (5-8 terms)`,vars:[{name:`paper_content`,label:`บทนำและบทสรุปของงานวิจัย`,placeholder:`วาง introduction และ conclusion ที่นี่`},{name:`journal_field`,label:`สาขา/วารสารเป้าหมาย`,placeholder:`เช่น วารสารด้านการจัดการธุรกิจ`},{name:`word_limit`,label:`จำนวนคำสูงสุด`,placeholder:`เช่น 250 คำ`}],tips:`Abstract ที่ follows academic conventions`},{id:73,category:`writing`,title:`Cover Letter — เขียน cover letter ที่โดดเด่น`,description:`ใช้เมื่อสมัครงานและต้องการ cover letter ที่ memorable`,template:`Write a cover letter.
Job: {{job_title_company}}
Key requirements from JD: {{key_requirements}}
My relevant experience: {{experience}}
Why this company specifically: {{why_company}}
My unique value: {{unique_value}}
Tone: professional but personal, not template`,vars:[{name:`job_title_company`,label:`ตำแหน่ง + บริษัท`,placeholder:`เช่น Data Analyst ที่บริษัท ABC`},{name:`key_requirements`,label:`คุณสมบัติสำคัญจาก JD (3 ข้อ)`,placeholder:`เช่น SQL, การนำเสนอข้อมูล, ทำงานเป็นทีม`},{name:`experience`,label:`ประสบการณ์ที่เกี่ยวข้อง`,placeholder:`เช่น เคยทำ data analysis 3 ปี`},{name:`why_company`,label:`เหตุผลที่สนใจบริษัทนี้โดยเฉพาะ`,placeholder:`เช่น ชื่นชมพันธกิจด้านความยั่งยืน`},{name:`unique_value`,label:`คุณค่าเฉพาะตัวที่คุณนำเสนอ`,placeholder:`เช่น ประสบการณ์ข้ามสายงานทั้ง data และ marketing`}],tips:`Cover letter ที่ get interview`},{id:74,category:`writing`,title:`Executive Bio — เขียน bio สำหรับ events`,description:`ใช้เมื่อต้องการ professional bio สำหรับ website หรือ speaker deck`,template:`Write a professional bio.
Name and current role: {{name_role}}
Career highlights: {{highlights}}
Areas of expertise: {{expertise}}
Unique angle: {{unique_angle}}
Length: {{length}}
POV: {{pov}}`,vars:[{name:`name_role`,label:`ชื่อและตำแหน่งปัจจุบัน`,placeholder:`เช่น คุณสมชาย ผู้ก่อตั้งและ CEO`},{name:`highlights`,label:`ผลงานเด่น (3 อันดับแรก)`,placeholder:`เช่น พาบริษัทเข้าตลาดหลักทรัพย์`},{name:`expertise`,label:`ความเชี่ยวชาญ`,placeholder:`เช่น กลยุทธ์ธุรกิจ, fintech`},{name:`unique_angle`,label:`จุดที่ทำให้คุณแตกต่าง`,placeholder:`เช่น ภูมิหลังด้านวิศวกรรมผสมธุรกิจ`},{name:`length`,label:`ความยาว`,placeholder:`50 words / 150 words / 300 words`},{name:`pov`,label:`มุมมองการเขียน`,placeholder:`first person / third person`}],tips:`Bio ที่ establish authority naturally`},{id:75,category:`writing`,title:`Apology Communication — เขียน apology อย่างมืออาชีพ`,description:`ใช้เมื่อเกิดข้อผิดพลาดและต้องการ apologize อย่างเหมาะสม`,template:`Write a professional apology.
What happened: {{what_happened}}
Who was affected: {{affected_party}}
Impact: {{impact}}
Corrective action taken: {{corrective_action}}
Tone: sincere, accountable, forward-looking
Don't: over-promise, make excuses, be defensive`,vars:[{name:`what_happened`,label:`สิ่งที่เกิดขึ้น (ข้อผิดพลาด/ปัญหา)`,placeholder:`เช่น ระบบล่มทำให้ลูกค้าใช้งานไม่ได้ 3 ชั่วโมง`},{name:`affected_party`,label:`ผู้ที่ได้รับผลกระทบ`,placeholder:`customer/partner/employee`},{name:`impact`,label:`ผลกระทบที่เกิดขึ้น`,placeholder:`เช่น ลูกค้าไม่สามารถทำธุรกรรมได้`},{name:`corrective_action`,label:`การแก้ไขที่ทำไปแล้ว/จะทำ`,placeholder:`เช่น เพิ่มระบบสำรองและตรวจสอบทุกชั่วโมง`}],tips:`Apology ที่ restore trust`},{id:76,category:`productivity`,title:`Project Planning — วาง project plan ที่ realistic`,description:`ใช้เมื่อต้องการ project plan ก่อนเริ่มงาน`,template:`Create a project plan for: {{project_name}}
Goal: {{goal}}
Timeline: {{timeline}}
Team: {{team}}
Key constraints: {{constraints}}
Include: milestones, tasks per milestone,
risk items, assumptions, success metrics`,vars:[{name:`project_name`,label:`ชื่อโครงการ`,placeholder:`เช่น ปรับปรุงเว็บไซต์บริษัท`},{name:`goal`,label:`ผลลัพธ์ที่ต้องการ`,placeholder:`เช่น เว็บไซต์ใหม่ที่โหลดเร็วขึ้น`},{name:`timeline`,label:`ระยะเวลา (วันเริ่ม-สิ้นสุด)`,placeholder:`เช่น 1 ส.ค. - 30 ก.ย. 2026`},{name:`team`,label:`ทีมงานที่มี`,placeholder:`เช่น นักพัฒนา 2 คน, นักออกแบบ 1 คน`},{name:`constraints`,label:`ข้อจำกัดสำคัญ`,placeholder:`เช่น งบประมาณ, ทรัพยากร, dependency`}],tips:`Plan ที่ realistic และ trackable`},{id:77,category:`productivity`,title:`Weekly Planning — organize สัปดาห์ให้มีประสิทธิภาพ`,description:`ใช้เมื่อต้องการ structure สัปดาห์ให้ get things done`,template:`Help me plan my week.
My goals this week: {{goals}}
Meetings already scheduled: {{meetings}}
Tasks outstanding: {{tasks}}
Energy pattern: {{energy_pattern}}
Create: daily schedule with deep work blocks,
task batching, buffer time, and end-of-day review`,vars:[{name:`goals`,label:`เป้าหมายหลักสัปดาห์นี้ (3 ข้อ)`,placeholder:`เช่น ปิดโปรเจกต์ A, เตรียม pitch deck`},{name:`meetings`,label:`meeting ที่นัดไว้แล้ว (พร้อมระยะเวลา)`,placeholder:`เช่น ประชุมทีมจันทร์ 1 ชม.`},{name:`tasks`,label:`งานค้างพร้อมเวลาที่คาดว่าจะใช้`,placeholder:`เช่น เขียนรายงาน 2 ชม.`},{name:`energy_pattern`,label:`ช่วงเวลาที่มีพลังงานสูงสุด`,placeholder:`am person/pm person`}],tips:`Week plan ที่ balanced`},{id:78,category:`productivity`,title:`Problem Solving — สร้าง solution ด้วย structured framework`,description:`ใช้เมื่อมีปัญหาที่ยากและต้องการ systematic approach`,template:`Help me solve this problem systematically.
Problem: {{problem}}
Constraints: {{constraints}}
Resources available: {{resources}}
What I've already tried: {{attempts}}
Use: Define > Causes > Options > Evaluate > Plan
Output: top 3 solutions with pros/cons + recommended next step`,vars:[{name:`problem`,label:`ปัญหาที่ต้องแก้ (อธิบายชัดเจน)`,placeholder:`เช่น ทีมส่งงานล่าช้าเป็นประจำ`},{name:`constraints`,label:`สิ่งที่จำกัดตัวเลือก`,placeholder:`เช่น ห้ามเพิ่มงบประมาณ`},{name:`resources`,label:`ทรัพยากรที่มี (เวลา, คน, งบ)`,placeholder:`เช่น มีเวลา 1 เดือน, ทีม 3 คน`},{name:`attempts`,label:`สิ่งที่เคยลองมาแล้ว`,placeholder:`เช่น เคยจัด standup meeting แล้วไม่ช่วย`}],tips:`Solution ที่ addressable ทันที`},{id:79,category:`productivity`,title:`Learning Plan — สร้าง self-study curriculum`,description:`ใช้เมื่อต้องการ learn topic ใหม่อย่างมีระบบ`,template:`Create a learning plan for: {{skill}}
Current level: {{current_level}}
Goal: {{goal}}
Time available: {{time_available}}
Timeline: {{timeline}}
Include: phased curriculum, resources per phase,
practice exercises, milestone checkpoints`,vars:[{name:`skill`,label:`ทักษะ/หัวข้อที่ต้องการเรียน`,placeholder:`เช่น Data Analysis ด้วย Python`},{name:`current_level`,label:`ระดับปัจจุบัน`,placeholder:`beginner/intermediate/advanced`},{name:`goal`,label:`ความสามารถที่ต้องการบรรลุ`,placeholder:`เช่น วิเคราะห์ข้อมูลและทำ dashboard ได้`},{name:`time_available`,label:`เวลาที่มีต่อสัปดาห์`,placeholder:`เช่น 5 ชั่วโมง/สัปดาห์`},{name:`timeline`,label:`ระยะเวลารวม`,placeholder:`เช่น 3 เดือน`}],tips:`Learning roadmap ที่ follow ได้จริง`},{id:80,category:`productivity`,title:`Brainstorming — generate ideas อย่างรวดเร็ว`,description:`ใช้เมื่อต้องการ ideas จำนวนมากก่อนกรอง`,template:`Generate ideas for: {{topic}}
Context: {{context}}
Constraints: {{constraints}}
Mode: {{mode}}
Quantity: 20 ideas minimum
After listing: group by theme, mark top 5,
suggest how to combine 2-3 ideas`,vars:[{name:`topic`,label:`หัวข้อ/โจทย์ที่ต้องการไอเดีย`,placeholder:`เช่น แคมเปญการตลาดปีใหม่`},{name:`context`,label:`ข้อมูลพื้นหลัง`,placeholder:`เช่น งบจำกัด เน้นกลุ่มลูกค้าวัยรุ่น`},{name:`constraints`,label:`ข้อจำกัด`,placeholder:`เช่น ต้องทำเสร็จภายใน 2 สัปดาห์`},{name:`mode`,label:`โหมดการคิด`,placeholder:`wild ideas / practical / combination`}],tips:`20+ ideas with clustering`},{id:81,category:`productivity`,title:`Prioritization — จัด priority ด้วย impact-effort`,description:`ใช้เมื่อมีหลายงานและต้องการ decide ว่าทำอะไรก่อน`,template:`Help me prioritize these tasks/initiatives.
Items: {{items}}
Goal: {{goal}}
Score each on: Impact (1-5) × Ease (1-5)
Plot into: Quick Wins, Big Bets, Fill-ins, Don'ts
Recommend: top 3 to focus on this sprint`,vars:[{name:`items`,label:`รายการงาน/โครงการทั้งหมด`,placeholder:`เช่น ปรับปรุง UI, เพิ่มฟีเจอร์ใหม่, แก้ bug เก่า`},{name:`goal`,label:`เป้าหมายที่ต้องการบรรลุ`,placeholder:`เช่น เพิ่ม user retention`}],tips:`Clear priority ranking พร้อม reasoning`},{id:82,category:`productivity`,title:`Process Documentation — เขียน process ให้คนอื่นทำตามได้`,description:`ใช้เมื่อมี process ที่ต้องการ document ให้ทีมใช้`,template:`Document this process.
Process: {{process_description}}
Frequency: {{frequency}}
Roles involved: {{roles}}
Tools used: {{tools}}
Write: overview, step-by-step instructions,
decision points, common errors, shortcuts`,vars:[{name:`process_description`,label:`อธิบาย process ด้วยคำพูดของคุณ`,placeholder:`เช่น ขั้นตอนการปิดยอดขายประจำเดือน`},{name:`frequency`,label:`ความถี่ในการทำ`,placeholder:`เช่น ทุกสิ้นเดือน`},{name:`roles`,label:`บทบาทที่เกี่ยวข้อง`,placeholder:`เช่น ฝ่ายบัญชี, ฝ่ายขาย`},{name:`tools`,label:`เครื่องมือที่ใช้`,placeholder:`เช่น Excel, ระบบ ERP`}],tips:`Process doc ที่ใครก็ทำตามได้`},{id:83,category:`productivity`,title:`Feedback Synthesis — รวบรวม feedback และสรุป themes`,description:`ใช้เมื่อได้รับ feedback จากหลายคนและต้องสรุป`,template:`Synthesize this feedback.
<feedback>{{feedback}}</feedback>
Context: {{context}}
Group into: strengths, weaknesses, opportunities
Find: top 3 themes with supporting examples
Recommend: 3 specific actions based on feedback`,vars:[{name:`feedback`,label:`feedback จากหลายแหล่ง`,placeholder:`วาง feedback ที่นี่`},{name:`context`,label:`สิ่งที่กำลังถูกประเมิน`,placeholder:`เช่น การประชุม kickoff โครงการใหม่`}],tips:`Synthesis ที่ actionable`},{id:84,category:`productivity`,title:`Delegation Brief — มอบหมายงานอย่างชัดเจน`,description:`ใช้เมื่อต้องการ delegate งานให้ทีมโดยไม่ต้อง micromanage`,template:`Create a delegation brief for: {{task}}
Delegating to: {{delegate_role}}
Task description: {{task_description}}
Success criteria: {{success_criteria}}
Deadline: {{deadline}}
Resources provided: {{resources}}
Check-in points: {{checkin_points}}
Authority level: {{authority_level}}`,vars:[{name:`task`,label:`งานที่จะมอบหมาย`,placeholder:`เช่น จัดทำรายงานสรุปยอดขายไตรมาส`},{name:`delegate_role`,label:`มอบหมายให้ใคร (ตำแหน่ง)`,placeholder:`เช่น Junior Analyst`},{name:`task_description`,label:`รายละเอียดงาน`,placeholder:`เช่น รวบรวมข้อมูลจาก 5 สาขาและสรุปเป็นรายงาน`},{name:`success_criteria`,label:`เกณฑ์ที่บอกว่า 'เสร็จ'`,placeholder:`เช่น รายงานถูกต้องและส่งตรงเวลา`},{name:`deadline`,label:`กำหนดเวลา`,placeholder:`เช่น 15 ก.ค. 2026`},{name:`resources`,label:`การสนับสนุนที่ให้`,placeholder:`เช่น เข้าถึงข้อมูล dashboard ได้เต็มสิทธิ์`},{name:`checkin_points`,label:`จุดที่ต้องอัปเดตความคืบหน้า`,placeholder:`เช่น ทุกวันศุกร์`},{name:`authority_level`,label:`ระดับอำนาจตัดสินใจ`,placeholder:`recommend/inform/decide independently`}],tips:`Brief ที่ empower ไม่ใช่ micromanage`},{id:85,category:`productivity`,title:`Retrospective — สรุปบทเรียนหลัง project`,description:`ใช้เมื่อจบ project หรือ sprint และต้องการ structured retro`,template:`Facilitate a retrospective.
Project/sprint: {{project_sprint}}
Team size: {{team_size}}
Duration: {{duration}}
Input: {{input_data}}
Structure: What went well, What to improve,
Surprises, Process improvements, Action items
Format as: team discussion guide with questions`,vars:[{name:`project_sprint`,label:`โครงการ/sprint ที่จะทำ retro`,placeholder:`เช่น Sprint 12`},{name:`team_size`,label:`จำนวนคนในทีม`,placeholder:`เช่น 6 คน`},{name:`duration`,label:`ระยะเวลาโครงการ/sprint`,placeholder:`เช่น 2 สัปดาห์`},{name:`input_data`,label:`ข้อมูล/บันทึก/ผลลัพธ์ที่มี`,placeholder:`วาง notes, outcomes, metrics ที่นี่`}],tips:`Retro guide ที่ generate real learnings`},{id:86,category:`productivity`,title:`OKR Writing — เขียน OKRs ที่วัดได้`,description:`ใช้เมื่อต้องการ OKRs ที่ clear และ motivating`,template:`Write OKRs for: {{team_scope}}
Quarter: {{quarter}}
Context: {{context}}
Draft objective: {{draft_objective}}
Refine to: 1 aspirational objective (not measurable)
3-5 Key Results (measurable, numeric, ambitious)
Each KR: baseline → target`,vars:[{name:`team_scope`,label:`ทีม/บริษัท/บุคคล`,placeholder:`เช่น ทีม Marketing`},{name:`quarter`,label:`ไตรมาส`,placeholder:`เช่น Q3 2026`},{name:`context`,label:`กลยุทธ์บริษัท + ความท้าทายปัจจุบัน`,placeholder:`เช่น ต้องการขยายฐานลูกค้าใหม่`},{name:`draft_objective`,label:`แนวคิด objective เบื้องต้นของคุณ`,placeholder:`เช่น เพิ่มการรับรู้แบรนด์`}],tips:`OKRs ที่ motivate และ measure`},{id:87,category:`productivity`,title:`SLA Definition — กำหนด service levels`,description:`ใช้เมื่อต้องการ define SLAs สำหรับ service หรือ support`,template:`Define SLAs for: {{service_type}}
Service: {{service_description}}
Customers: {{customers}}
Define: response time, resolution time per priority,
measurement method, escalation path,
reporting frequency, consequences of breach`,vars:[{name:`service_type`,label:`ประเภทบริการ`,placeholder:`เช่น IT support`},{name:`service_description`,label:`คำอธิบายบริการที่ให้`,placeholder:`เช่น แก้ปัญหาระบบคอมพิวเตอร์ให้พนักงาน`},{name:`customers`,label:`ลูกค้า (internal/external, ความคาดหวัง)`,placeholder:`เช่น พนักงานภายในที่ต้องการแก้ไขเร่งด่วน`}],tips:`SLA document ที่ clear และ fair`},{id:88,category:`productivity`,title:`Onboarding Plan — plan ต้อนรับพนักงานใหม่`,description:`ใช้เมื่อมีพนักงานใหม่เข้าและต้องการ onboarding ที่ดี`,template:`Create an onboarding plan for a new {{role}}.
Team: {{team_name}} | Start date: {{start_date}}
First month goals: {{first_month_goals}}
Key stakeholders to meet: {{stakeholders}}
Systems to set up: {{systems}}
Include: Day 1, Week 1, Month 1 structure,
buddy assignment, 30-day check-in agenda`,vars:[{name:`role`,label:`ตำแหน่งพนักงานใหม่`,placeholder:`เช่น Software Engineer`},{name:`team_name`,label:`ชื่อทีม`,placeholder:`เช่น ทีม Platform`},{name:`start_date`,label:`วันเริ่มงาน`,placeholder:`เช่น 1 ส.ค. 2026`},{name:`first_month_goals`,label:`เป้าหมายเดือนแรก`,placeholder:`เช่น เข้าใจระบบและ deploy งานเล็กได้`},{name:`stakeholders`,label:`ผู้เกี่ยวข้องที่ต้องพบพร้อมจุดประสงค์`,placeholder:`เช่น หัวหน้าทีม, HR, buddy`},{name:`systems`,label:`ระบบที่ต้องตั้งค่า`,placeholder:`เช่น email, Slack, VPN`}],tips:`Onboarding ที่ ramp up ได้เร็ว`},{id:89,category:`productivity`,title:`Budget Allocation — วางงบประมาณ`,description:`ใช้เมื่อต้องการ allocate budget อย่าง strategic`,template:`Help me allocate this budget.
Total budget: {{total_budget}}
Period: {{period}}
Business goals: {{goals}}
Current spending by category: {{current_spending}}
Recommend: allocation by category with rationale,
ROI expectation per category,
what to cut if 20% reduction required`,vars:[{name:`total_budget`,label:`งบประมาณรวม`,placeholder:`เช่น 5,000,000 บาท`},{name:`period`,label:`ช่วงเวลา`,placeholder:`เช่น ปีงบประมาณ 2026`},{name:`goals`,label:`เป้าหมายธุรกิจ (3-5 ข้อ)`,placeholder:`เช่น เพิ่มยอดขาย 20%, ขยายตลาดใหม่`},{name:`current_spending`,label:`การใช้จ่ายปัจจุบันตามหมวด (ถ้ามี)`,placeholder:`เช่น การตลาด 40%, R&D 30%`}],tips:`Budget allocation ที่ strategic`},{id:90,category:`productivity`,title:`Post-Mortem — วิเคราะห์หลัง incident`,description:`ใช้เมื่อเกิด incident และต้องการ learn โดยไม่ blame`,template:`Write a post-mortem for: {{incident}}
Date/time: {{datetime}}
Impact: {{impact}}
Timeline: {{timeline}}
Root causes: {{root_causes}}
Detection: {{detection}}
Format: blameless. Focus on: what happened,
why, how to prevent, action items with owners`,vars:[{name:`incident`,label:`ชื่อ/คำอธิบาย incident`,placeholder:`เช่น ระบบล่มช่วงเที่ยง`},{name:`datetime`,label:`วันและเวลาที่เกิด`,placeholder:`เช่น 5 ก.ค. 2026 12:15 น.`},{name:`impact`,label:`ผลกระทบที่เกิดขึ้น`,placeholder:`เช่น ผู้ใช้ไม่สามารถ login ได้ 45 นาที`},{name:`timeline`,label:`ลำดับเหตุการณ์`,placeholder:`เช่น 12:15 เริ่มพบปัญหา, 13:00 แก้ไขสำเร็จ`},{name:`root_causes`,label:`สาเหตุที่แท้จริง`,placeholder:`เช่น database connection pool เต็ม`},{name:`detection`,label:`วิธีที่พบปัญหา`,placeholder:`เช่น alert จากระบบ monitoring`}],tips:`Post-mortem ที่ prevent recurrence`}]};export{e as t};