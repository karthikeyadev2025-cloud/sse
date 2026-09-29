// Field schemas that drive the Super Admin editors.
// Add a field here and it instantly appears in the admin panel and is saved to the database.

const heroFields = [
  { name: 'hero_eyebrow', label: 'Breadcrumb label', type: 'text' },
  { name: 'hero_title', label: 'Title (dark part)', type: 'text' },
  { name: 'hero_highlight', label: 'Title (green highlight)', type: 'text' },
  { name: 'hero_subtitle', label: 'Subtitle', type: 'text' },
  { name: 'hero_text', label: 'Intro paragraph', type: 'textarea' },
  { name: 'hero_image', label: 'Banner image', type: 'image' },
  { name: 'hero_side_text', label: 'Text on green corner (use new line to break)', type: 'textarea', rows: 2 },
  { name: 'hero_badges', label: 'Icon badges', type: 'repeater', fields: [{ name: 'icon', label: 'Icon', type: 'icon' }, { name: 'label', label: 'Label', type: 'text' }] },
]
const ctaFields = [
  { name: 'cta_title', label: 'CTA title', type: 'text' },
  { name: 'cta_text', label: 'CTA text', type: 'textarea', rows: 2 },
]

export const CONTENT_SCHEMAS = {
  settings: {
    label: 'Site Settings',
    sections: [
      { title: 'Brand', fields: [
        { name: 'company_name', label: 'Company name', type: 'text' },
        { name: 'tagline', label: 'Tagline', type: 'text' },
        { name: 'logo', label: 'Logo (header & footer)', type: 'image', hint: 'Transparent PNG works best' },
        { name: 'logo_full', label: 'Full logo with tagline', type: 'image' },
        { name: 'favicon', label: 'Browser tab icon (favicon — square PNG)', type: 'image' },
        { name: 'admin_bg', label: 'Admin login page background image', type: 'image' },
      ] },
      { title: 'Contact details', fields: [
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'phone_alt', label: 'Alternate phone', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'address', label: 'Address', type: 'textarea', rows: 2 },
        { name: 'working_hours', label: 'Working hours', type: 'text' },
        { name: 'working_note', label: 'Working hours note', type: 'text' },
        { name: 'map_embed_url', label: 'Google Map embed URL', type: 'text', hint: 'Google Maps → Share → Embed a map → copy the src="…" link' },
        { name: 'map_link', label: 'Google Maps directions link', type: 'text' },
      ] },
      { title: 'WhatsApp & enquiry', fields: [
        { name: 'whatsapp', label: 'WhatsApp number (with country code, no +)', type: 'text', hint: 'Example: 919945437725' },
        { name: 'whatsapp_default_message', label: 'Default WhatsApp message', type: 'textarea', rows: 2 },
        { name: 'whatsapp_after_form', label: 'Also open WhatsApp after a form is submitted', type: 'switch' },
        { name: 'show_whatsapp_float', label: 'Show floating WhatsApp button', type: 'switch' },
        { name: 'show_call_float', label: 'Show floating Call button', type: 'switch' },
        { name: 'header_cta_text', label: 'Top bar button text', type: 'text' },
        { name: 'announcement', label: 'Announcement bar (leave empty to hide)', type: 'text' },
        { name: 'brochure_url', label: 'Company brochure (PDF)', type: 'file', accept: 'application/pdf' },
      ] },
      { title: 'Social media', fields: [
        { name: 'facebook', label: 'Facebook URL', type: 'text' },
        { name: 'youtube', label: 'YouTube URL', type: 'text' },
        { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
        { name: 'instagram', label: 'Instagram URL', type: 'text' },
      ] },
      { title: 'Footer', fields: [
        { name: 'footer_about', label: 'Footer about text', type: 'textarea', rows: 3 },
        { name: 'footer_quote', label: 'Footer quote', type: 'text' },
        { name: 'footer_bottom', label: 'Bottom-right line', type: 'text' },
        { name: 'copyright', label: 'Copyright ({year} = current year)', type: 'text' },
        { name: 'credit_text', label: 'Developer credit text', type: 'text' },
        { name: 'credit_url', label: 'Developer credit link', type: 'text' },
      ] },
      { title: 'SEO', fields: [
        { name: 'seo_title', label: 'Home page title', type: 'text' },
        { name: 'seo_description', label: 'Meta description', type: 'textarea', rows: 3 },
      ] },
    ],
  },
  common: {
    label: 'Common Sections',
    sections: [
      { title: 'Statistics (used on Home, About, Projects)', fields: [
        { name: 'stats', label: 'Stats', type: 'repeater', fields: [{ name: 'icon', label: 'Icon', type: 'icon' }, { name: 'value', label: 'Value (e.g. 100+)', type: 'text' }, { name: 'label', label: 'Label', type: 'text' }] },
      ] },
      { title: 'Why Choose Us', fields: [
        { name: 'why', label: 'Items', type: 'repeater', fields: [{ name: 'icon', label: 'Icon', type: 'icon' }, { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'text' }] },
      ] },
      { title: 'Default call-to-action band', fields: [...ctaFields, { name: 'cta_button', label: 'Button text', type: 'text' }, { name: 'cta_image', label: 'Background image', type: 'image' }] },
    ],
  },
  home: {
    label: 'Home Page',
    note: 'Hero slides (big banner) are managed under Content → Hero Slides.',
    sections: [
      { title: 'Hero extras', fields: [
        { name: 'hero_badges', label: 'Hero icon badges', type: 'repeater', fields: [{ name: 'icon', label: 'Icon', type: 'icon' }, { name: 'label', label: 'Label', type: 'text' }] },
        { name: 'hero_side_title', label: 'Top-right card title', type: 'textarea', rows: 2 },
        { name: 'hero_side_text', label: 'Top-right card text', type: 'text' },
        { name: 'hero_corner_text', label: 'Green corner text', type: 'textarea', rows: 2 },
      ] },
      { title: 'Feature strip', fields: [
        { name: 'strip', label: 'Strip items', type: 'repeater', fields: [{ name: 'icon', label: 'Icon', type: 'icon' }, { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'text' }] },
      ] },
      { title: 'Products section', fields: [{ name: 'products_eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'products_title', label: 'Title', type: 'text' }] },
      { title: 'About section', fields: [
        { name: 'about_eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'about_title', label: 'Title', type: 'text' },
        { name: 'about_text', label: 'Text', type: 'textarea' }, { name: 'about_image', label: 'Main image', type: 'image' }, { name: 'about_image2', label: 'Small overlapping image', type: 'image' }, { name: 'about_points', label: 'Tick-mark points', type: 'list' }, { name: 'about_button', label: 'Button text', type: 'text' },
      ] },
      { title: 'Process section', fields: [
        { name: 'process_eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'process_title', label: 'Title', type: 'text' },
        { name: 'process', label: 'Steps', type: 'repeater', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'text' }] },
      ] },
      { title: 'Full-width image band', fields: [
        { name: 'band_eyebrow', label: 'Small label', type: 'text' }, { name: 'band_title', label: 'Title', type: 'text' },
        { name: 'band_text', label: 'Text', type: 'textarea', rows: 2 }, { name: 'band_image', label: 'Background image', type: 'image' }, { name: 'band_button', label: 'Button text', type: 'text' },
      ] },
      { title: 'Industries & Projects sections', fields: [
        { name: 'industries_eyebrow', label: 'Industries eyebrow', type: 'text' }, { name: 'industries_title', label: 'Industries title', type: 'text' },
        { name: 'projects_eyebrow', label: 'Projects eyebrow', type: 'text' }, { name: 'projects_title', label: 'Projects title', type: 'text' },
      ] },
      { title: 'Why choose & video', fields: [
        { name: 'why_title', label: 'Section title', type: 'text' },
        { name: 'video_image', label: 'Video cover image', type: 'image' },
        { name: 'video_url', label: 'Video (upload MP4 or paste YouTube link)', type: 'video' },
        { name: 'video_title', label: 'Video title', type: 'text' }, { name: 'video_sub', label: 'Video subtitle', type: 'text' },
      ] },
      { title: 'Other headings', fields: [{ name: 'clients_strip_title', label: 'Client logos strip title', type: 'text' }, { name: 'testimonials_title', label: 'Testimonials title', type: 'text' }, { name: 'faq_title', label: 'FAQ title', type: 'text' }] },
    ],
  },
  about: {
    label: 'About Page',
    sections: [
      { title: 'Hero', fields: heroFields },
      { title: 'Story, mission & vision', fields: [
        { name: 'story_title', label: 'Story title', type: 'text' }, { name: 'story_text', label: 'Story paragraph 1', type: 'textarea' }, { name: 'story_text2', label: 'Story paragraph 2', type: 'textarea' },
        { name: 'mission', label: 'Mission', type: 'textarea' }, { name: 'vision', label: 'Vision', type: 'textarea' }, { name: 'values', label: 'Values', type: 'list' },
      ] },
      { title: 'Banner', fields: [{ name: 'banner_text', label: 'Banner text', type: 'text' }, { name: 'banner_image', label: 'Banner image', type: 'image' }] },
      { title: 'Video', fields: [{ name: 'video_image', label: 'Cover image', type: 'image' }, { name: 'video_url', label: 'Video (upload MP4 or paste YouTube link)', type: 'video' }, { name: 'video_title', label: 'Title', type: 'text' }, { name: 'video_sub', label: 'Subtitle', type: 'text' }] },
    ],
  },
  products_page: { label: 'Products Page', sections: [{ title: 'Hero', fields: heroFields }, { title: 'Sidebar help box', fields: [{ name: 'help_title', label: 'Title', type: 'text' }, { name: 'help_text', label: 'Text', type: 'textarea', rows: 2 }] }, { title: 'Bottom CTA', fields: ctaFields }] },
  projects_page: { label: 'Projects Page', sections: [{ title: 'Hero', fields: heroFields }, { title: 'Bottom CTA', fields: ctaFields }] },
  industries_page: { label: 'Industries Page', sections: [{ title: 'Hero', fields: heroFields }, { title: 'Section', fields: [{ name: 'section_eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'section_title', label: 'Title', type: 'text' }, { name: 'section_text', label: 'Text', type: 'textarea', rows: 2 }] }, { title: 'Bottom CTA', fields: [...ctaFields, { name: 'cta_button', label: 'Button', type: 'text' }] }] },
  services_page: { label: 'Services Page', sections: [{ title: 'Hero', fields: heroFields }, { title: 'Section', fields: [{ name: 'section_title', label: 'Title', type: 'text' }, { name: 'section_text', label: 'Text', type: 'textarea', rows: 2 }, { name: 'benefits', label: 'Benefits row', type: 'repeater', fields: [{ name: 'icon', label: 'Icon', type: 'icon' }, { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'text' }] }] }, { title: 'Bottom CTA', fields: [...ctaFields, { name: 'cta_button', label: 'Button', type: 'text' }] }] },
  clients_page: {
    label: 'Clients Page',
    note: 'Client names/logos are managed under Content → Clients, reviews under Content → Testimonials.',
    sections: [
      { title: 'Hero', fields: heroFields },
      { title: 'Clients section', fields: [{ name: 'clients_eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'clients_title', label: 'Title', type: 'text' }, { name: 'clients_text', label: 'Text', type: 'textarea', rows: 2 }] },
      { title: 'Testimonials section', fields: [{ name: 'testimonials_eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'testimonials_title', label: 'Title', type: 'text' }, { name: 'testimonials_text', label: 'Text', type: 'textarea', rows: 2 }] },
      { title: 'Client feedback form', fields: [{ name: 'feedback_enabled', label: 'Let clients submit feedback (published only after you approve it)', type: 'switch' }, { name: 'feedback_title', label: 'Form title', type: 'text' }, { name: 'feedback_text', label: 'Form text', type: 'textarea', rows: 2 }] },
      { title: 'Bottom CTA', fields: [...ctaFields, { name: 'cta_button', label: 'Button', type: 'text' }] },
    ],
  },
  gallery_page: { label: 'Gallery Page', sections: [{ title: 'Hero', fields: heroFields }, { title: 'Bottom CTA', fields: [...ctaFields, { name: 'cta_button', label: 'Button', type: 'text' }] }] },
  contact_page: { label: 'Contact Page', sections: [{ title: 'Hero', fields: heroFields }, { title: 'Form', fields: [{ name: 'form_title', label: 'Form title', type: 'text' }, { name: 'enquiry_types', label: 'Enquiry types (dropdown options)', type: 'list' }] }, { title: 'Highlights row', fields: [{ name: 'highlights', label: 'Items', type: 'repeater', fields: [{ name: 'icon', label: 'Icon', type: 'icon' }, { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'text' }] }] }] },
}

export const COLLECTION_SCHEMAS = {
  hero_slides: {
    label: 'Hero Slides', singular: 'Slide', titleField: 'title', subField: 'highlight', imageField: 'image',
    fields: [
      { name: 'image', label: 'Background image', type: 'image', required: true },
      { name: 'video', label: 'Background video (optional MP4 — plays muted, image shown while loading)', type: 'video', uploadOnly: true },
      { name: 'eyebrow', label: 'Small label', type: 'text' },
      { name: 'title', label: 'Title (dark)', type: 'text', required: true },
      { name: 'highlight', label: 'Title (green highlight)', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
      { name: 'btn1_text', label: 'Primary button text', type: 'text', half: true },
      { name: 'btn1_link', label: 'Primary button link (#quote opens enquiry)', type: 'text', half: true },
      { name: 'btn2_text', label: 'Second button text', type: 'text', half: true },
      { name: 'btn2_link', label: 'Second button link', type: 'text', half: true },
    ],
  },
  products: {
    label: 'Products', singular: 'Product', titleField: 'title', subField: 'category', imageField: 'image', categoryCollection: 'product_categories',
    fields: [
      { name: 'title', label: 'Product name', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'slug', from: 'title' },
      { name: 'category', label: 'Category', type: 'select', optionsFrom: 'product_categories' },
      { name: 'featured', label: 'Show on Home page (featured)', type: 'switch' },
      { name: 'image', label: 'Main image', type: 'image', required: true },
      { name: 'images', label: 'More images (gallery)', type: 'images' },
      { name: 'short_desc', label: 'Short description (cards)', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 6 },
      { name: 'features', label: 'Key features', type: 'list' },
      { name: 'specs', label: 'Specifications', type: 'specs' },
      { name: 'video_url', label: 'Product video (upload MP4 or YouTube link)', type: 'video' },
      { name: 'brochure', label: 'Product brochure PDF (optional)', type: 'file', accept: 'application/pdf' },
    ],
  },
  product_categories: { label: 'Product Categories', singular: 'Category', titleField: 'name', subField: 'slug', fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'slug', from: 'name' }] },
  projects: {
    label: 'Projects', singular: 'Project', titleField: 'title', subField: 'location', imageField: 'image', categoryCollection: 'project_categories',
    fields: [
      { name: 'title', label: 'Project title', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'slug', from: 'title' },
      { name: 'category', label: 'Category', type: 'select', optionsFrom: 'project_categories' },
      { name: 'featured', label: 'Show on Home page', type: 'switch' },
      { name: 'location', label: 'Location', type: 'text', half: true },
      { name: 'capacity', label: 'Capacity (e.g. 100 TPD)', type: 'text', half: true },
      { name: 'client', label: 'Client name (optional)', type: 'text', half: true },
      { name: 'year', label: 'Year', type: 'text', half: true },
      { name: 'image', label: 'Main image', type: 'image', required: true },
      { name: 'images', label: 'More images', type: 'images' },
      { name: 'short_desc', label: 'Short description', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 6 },
      { name: 'video_url', label: 'Project video (upload MP4 or YouTube link)', type: 'video' },
    ],
  },
  project_categories: { label: 'Project Categories', singular: 'Category', titleField: 'name', subField: 'slug', fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'slug', from: 'name' }] },
  industries: {
    label: 'Industries', singular: 'Industry', titleField: 'title', subField: 'short_desc', imageField: 'image',
    fields: [
      { name: 'title', label: 'Industry name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', from: 'title' },
      { name: 'featured', label: 'Show on Home page', type: 'switch' },
      { name: 'image', label: 'Image', type: 'image', required: true },
      { name: 'short_desc', label: 'Short description', type: 'textarea', rows: 2 },
    ],
  },
  services: {
    label: 'Services', singular: 'Service', titleField: 'title', subField: 'short_desc', imageField: 'image',
    fields: [
      { name: 'title', label: 'Service name', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'slug', from: 'title' },
      { name: 'icon', label: 'Icon', type: 'icon' },
      { name: 'image', label: 'Image', type: 'image', required: true },
      { name: 'short_desc', label: 'Short description', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 6 },
      { name: 'features', label: 'Highlights', type: 'list' },
      { name: 'video_url', label: 'Service video (upload MP4 or YouTube link)', type: 'video' },
    ],
  },
  gallery: {
    label: 'Gallery', singular: 'Photo', titleField: 'title', subField: 'category', imageField: 'image', categoryCollection: 'gallery_categories', grid: true, bulkUpload: true,
    fields: [
      { name: 'image', label: 'Image', type: 'image', required: true },
      { name: 'title', label: 'Caption', type: 'text' },
      { name: 'category', label: 'Category', type: 'select', optionsFrom: 'gallery_categories' },
      { name: 'video_url', label: 'Video (optional — upload MP4 or YouTube link; the image above becomes its cover)', type: 'video' },
    ],
  },
  gallery_categories: { label: 'Gallery Categories', singular: 'Category', titleField: 'name', subField: 'slug', fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'slug', from: 'name' }] },
  testimonials: {
    label: 'Testimonials', singular: 'Testimonial', titleField: 'name', subField: 'company', imageField: 'photo',
    note: 'Feedback sent from the Clients page arrives here as “Pending approval”. Open it, check it, switch on “Visible on website” and save.',
    fields: [
      { name: 'name', label: 'Client name', type: 'text', required: true, half: true },
      { name: 'designation', label: 'Designation (e.g. Owner, Plant Manager)', type: 'text', half: true },
      { name: 'company', label: 'Company / rice mill name', type: 'text', half: true },
      { name: 'location', label: 'City / State', type: 'text', half: true },
      { name: 'project', label: 'Project delivered (optional)', type: 'text' },
      { name: 'message', label: 'Testimonial', type: 'textarea', rows: 4, required: true },
      { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5, half: true },
      { name: 'featured', label: 'Show in Home page slider', type: 'switch', half: true },
      { name: 'photo', label: 'Client photo (optional)', type: 'image' },
      { name: 'video_url', label: 'Video testimonial (optional — upload MP4 or YouTube link)', type: 'video' },
      { name: 'phone', label: 'Client phone (internal only, never shown on website)', type: 'text' },
    ],
  },
  clients: {
    label: 'Clients', singular: 'Client', titleField: 'name', subField: 'location', imageField: 'logo',
    note: 'Clients appear on the Clients page and in the scrolling strip on the Home page. Upload a logo, or leave it empty to show the name.',
    fields: [
      { name: 'name', label: 'Client / company name', type: 'text', required: true },
      { name: 'logo', label: 'Logo (transparent PNG works best)', type: 'image' },
      { name: 'location', label: 'City / State', type: 'text', half: true },
      { name: 'industry', label: 'Industry (e.g. Rice Mill)', type: 'text', half: true },
      { name: 'project', label: 'Project delivered', type: 'text', half: true },
      { name: 'website', label: 'Website link (optional)', type: 'text', half: true },
    ],
  },
  faqs: {
    label: 'FAQs', singular: 'FAQ', titleField: 'question', subField: 'answer',
    fields: [{ name: 'question', label: 'Question', type: 'text', required: true }, { name: 'answer', label: 'Answer', type: 'textarea', rows: 4, required: true }],
  },
}

export const ENQUIRY_STATUSES = [
  { value: 'new', label: 'New', cls: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', cls: 'bg-amber-100 text-amber-700' },
  { value: 'quoted', label: 'Quoted', cls: 'bg-purple-100 text-purple-700' },
  { value: 'won', label: 'Won', cls: 'bg-green-100 text-green-700' },
  { value: 'closed', label: 'Closed', cls: 'bg-gray-200 text-gray-700' },
]
