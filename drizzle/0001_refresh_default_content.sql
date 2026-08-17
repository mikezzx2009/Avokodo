-- Refresh only the untouched singleton created by the original Avokodo seed.
-- Any draft save or publish increments revision, so editor-authored content is
-- intentionally left alone. The revision predicate also makes this idempotent.
WITH refreshed_seed(content) AS (
  VALUES ('{"site":{"name":"Avokodo","tagline":"Design it. Engineer it. Make it.","email":null},"navigation":[{"label":"About","href":"#about"},{"label":"Services","href":"#services"},{"label":"Work","href":"#work"},{"label":"Process","href":"#process"},{"label":"Contact","href":"#contact"}],"hero":{"eyebrow":"Industrial design · Engineering · Manufacturing","title":"Products, designed all the way to production.","description":"Avokodo connects product and industrial design, 3D engineering, prototyping, tooling, and manufacturing through a studio in Guangdong and Hong Kong and a factory in Dongguan.","primaryCta":{"label":"Discuss a product","href":"#contact"},"secondaryCta":{"label":"See selected work","href":"#work"},"image":{"id":"upwork-brand-film","url":"/upwork-assets/brand-film.jpg","alt":"Rendered rounded product forms in white, peach, and slate blue"}},"about":{"eyebrow":"Studio and factory","title":"One connected path from design intent to manufactured detail.","paragraphs":["Avokodo is a design studio in Guangdong and Hong Kong with a factory in Dongguan, bringing product design and manufacturing into one practical workflow.","The authorized Upwork profile records 10+ years of experience, Top Rated status, 100% Job Success, a 5.0 rating across 22 reviews, and 28 total jobs."],"image":null,"facts":[{"id":"job-success","value":"100%","label":"Upwork Job Success"},{"id":"upwork-status","value":"Top Rated","label":"Upwork status"},{"id":"total-jobs","value":"28","label":"Total jobs"},{"id":"experience","value":"10+","label":"Years of experience"}]},"services":{"eyebrow":"Capabilities","title":"From the first line on paper to production on the floor.","intro":"Choose a focused design engagement or connect the full product-development path through one team.","items":[{"id":"product-design","number":"01","title":"Product & industrial design","description":"Turn a brief into clear product concepts, balancing form, function, user needs, materials, and production intent.","capabilities":["Concept design","Sketching","Technical drawing","Industrial design"]},{"id":"3d-engineering","number":"02","title":"3D modeling & rendering","description":"Develop precise 3D models and persuasive visualizations for design review, engineering, and manufacturing handoff.","capabilities":["SolidWorks","UG","Pro/E","CAD","Blender","Rhino","KeyShot"]},{"id":"prototyping-tooling","number":"03","title":"Prototyping & tooling","description":"Move from digital model to physical proof, then prepare the molds and fabrication route required for production.","capabilities":["3D printing","Prototyping","Injection molds","Silicone molds","Metal die casting","Tooling & fabrication"]},{"id":"manufacturing","number":"04","title":"ODM, OEM & manufacturing","description":"Carry an approved product into manufacturing with the design, engineering, tooling, and factory stages connected.","capabilities":["ODM","OEM","Manufacturing","Production handoff"]}]},"work":{"eyebrow":"Portfolio","title":"Selected products, from concept to manufacture.","intro":"Three examples from the visible Avokodo portfolio, spanning early form development, 3D product engineering, and manufactured finishes.","items":[{"id":"high-end-accessories","title":"High-end personal accessories","category":"Concept sketch · Industrial design","description":"An early form study translating dimensions and ergonomics into a clear product direction.","image":{"id":"upwork-high-end-accessories","url":"/upwork-assets/high-end-accessories.jpg","alt":"Dimensioned hand sketch for a curved personal accessory"},"href":"https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1"},{"id":"wearable-product","title":"Wearable product from design to manufacture","category":"3D modeling · Design for manufacturing","description":"A wearable concept developed through 3D form, fit, engineering, and preparation for manufacture.","image":{"id":"upwork-wearable-product","url":"/upwork-assets/wearable-product.jpg","alt":"Blue 3D rendering of two circular wearable product components"},"href":"https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1"},{"id":"phone-case-leather","title":"Phone case + leather","category":"Product development · Manufacturing","description":"A phone-case structure paired with a leather finish and shown as a physical production sample.","image":{"id":"upwork-phone-case-leather","url":"/upwork-assets/phone-case-leather.jpg","alt":"Black phone-case camera surround held above leather-finished cases"},"href":"https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1"}]},"process":{"eyebrow":"Product path","title":"A practical route from brief to production.","intro":"The scope can begin at any stage, or continue as one connected design-and-manufacturing engagement.","steps":[{"id":"brief-concept","number":"01","title":"Brief & concept","description":"Define product requirements, explore ideas, and establish a design direction."},{"id":"design-engineer","number":"02","title":"Design & engineer","description":"Resolve form and function through sketches, technical drawings, and 3D models."},{"id":"prototype-validate","number":"03","title":"Prototype & validate","description":"Use 3D printing and physical prototypes to review fit, feel, and production details."},{"id":"tool-manufacture","number":"04","title":"Tool & manufacture","description":"Prepare molds or fabrication, then move the approved product into manufacturing."}]},"contact":{"eyebrow":"Start on Upwork","title":"Bring the brief. Leave with a clear product path.","description":"Share the product idea, target material, quantity, and timing. Avokodo can help identify the right next step, from design through manufacturing.","email":null,"ctaLabel":"View profile & start a conversation","ctaHref":"https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1"},"footer":{"tagline":"Product design and manufacturing, connected.","links":[{"label":"Back to top","href":"#top"},{"label":"Contact","href":"#contact"}],"copyright":"© Avokodo. All rights reserved."}}')
)
UPDATE site_documents
SET draft_json = (SELECT content FROM refreshed_seed),
    published_json = (SELECT content FROM refreshed_seed),
    revision = revision + 1,
    updated_at = CURRENT_TIMESTAMP,
    published_at = CURRENT_TIMESTAMP
WHERE id = 'main'
  AND revision = 1
  AND draft_json = published_json
  AND json_extract(draft_json, '$.hero.title') =
      'We turn complex product ideas into clear, useful experiences.'
  AND json_array_length(draft_json, '$.work.items') = 0;
--> statement-breakpoint
-- Preserve editor-authored documents while adding the new required facts
-- collection to legacy draft or published JSON that predates this field.
UPDATE site_documents
SET draft_json = CASE
      WHEN json_type(draft_json, '$.about.facts') IS NULL
      THEN json_set(
        draft_json,
        '$.about.facts',
        json('[{"id":"job-success","value":"100%","label":"Upwork Job Success"},{"id":"upwork-status","value":"Top Rated","label":"Upwork status"},{"id":"total-jobs","value":"28","label":"Total jobs"},{"id":"experience","value":"10+","label":"Years of experience"}]')
      )
      ELSE draft_json
    END,
    published_json = CASE
      WHEN json_type(published_json, '$.about.facts') IS NULL
      THEN json_set(
        published_json,
        '$.about.facts',
        json('[{"id":"job-success","value":"100%","label":"Upwork Job Success"},{"id":"upwork-status","value":"Top Rated","label":"Upwork status"},{"id":"total-jobs","value":"28","label":"Total jobs"},{"id":"experience","value":"10+","label":"Years of experience"}]')
      )
      ELSE published_json
    END,
    revision = revision + 1,
    updated_at = CURRENT_TIMESTAMP,
    published_at = CASE
      WHEN json_type(published_json, '$.about.facts') IS NULL
      THEN CURRENT_TIMESTAMP
      ELSE published_at
    END
WHERE id = 'main'
  AND (
    json_type(draft_json, '$.about.facts') IS NULL
    OR json_type(published_json, '$.about.facts') IS NULL
  );
