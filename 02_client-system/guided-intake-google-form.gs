/**
 * NoDrftSystems — Guided Client Intake Form
 * Google Apps Script
 *
 * HOW TO USE
 * ----------
 * 1. Go to script.google.com (sign in with admin@nodrftsystems.com)
 * 2. Click "New project"
 * 3. Delete all existing code in the editor
 * 4. Paste this entire file
 * 5. Click Run > createIntakeForm
 * 6. Approve the permissions when prompted
 * 7. After it runs, check the Execution Log (View > Logs) for your form URLs
 * 8. Follow the NEXT STEPS in the log to enable email notifications
 *
 * Classification: Internal — Proprietary
 */

function createIntakeForm() {

  // ── Create form ──────────────────────────────────────────────────────────
  var form = FormApp.create('NoDrftSystems — New Client Intake');

  form.setTitle('NoDrftSystems — Let\'s Get to Know Your Project')
      .setDescription(
        'This short form helps us understand what you need so we can recommend the right approach. ' +
        'It takes about 5–8 minutes to complete. All information is kept strictly confidential.\n\n' +
        'There are no wrong answers. Just pick the option closest to your situation and add notes where helpful.'
      )
      .setConfirmationMessage(
        'Thank you — we\'ve received your information.\n\n' +
        'We\'ll review your responses carefully and reach out within 1–2 business days to schedule a short intro call. ' +
        'No commitments at this stage — just a conversation to make sure we\'re the right fit.\n\n' +
        'Questions in the meantime? Email info@nodrftsystems.com'
      )
      .setCollectEmail(true)
      .setAllowResponseEdits(false)
      .setLimitOneResponsePerUser(false)
      .setProgressBar(true)
      .setShuffleQuestions(false);


  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 1 — ABOUT YOU
  // ══════════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
      .setTitle('Part 1 of 5 — About You & Your Business')
      .setHelpText('Start with the basics so we know who we\'re speaking with.');

  form.addTextItem()
      .setTitle('Your full name')
      .setRequired(true);

  form.addTextItem()
      .setTitle('Your business name')
      .setRequired(true);

  form.addTextItem()
      .setTitle('Your email address')
      .setRequired(true)
      .setHelpText('We\'ll use this to follow up with you. We never share it.');

  form.addTextItem()
      .setTitle('Your phone number')
      .setRequired(false)
      .setHelpText('Optional — include if you prefer a call over email.');

  form.addTextItem()
      .setTitle('Your role in the business')
      .setRequired(true)
      .setHelpText('e.g. Owner, CEO, Director of Marketing, IT Manager');

  form.addListItem()
      .setTitle('What type of business do you run?')
      .setRequired(true)
      .setChoiceValues([
        'Technology / Software',
        'Professional services (law, accounting, consulting, finance)',
        'Healthcare or medical',
        'Real estate or property',
        'Online shop / retail / e-commerce',
        'Food, hospitality, or events',
        'Construction, trades, or home services',
        'Education or training',
        'Media, content, or publishing',
        'Non-profit or charity',
        'Government or public sector',
        'Manufacturing or logistics',
        'Other'
      ]);

  form.addListItem()
      .setTitle('How many people work in your business?')
      .setRequired(true)
      .setChoiceValues([
        'Just me (solo)',
        '2 – 10 people',
        '11 – 50 people',
        '51 – 200 people',
        '200+ people'
      ]);

  form.addMultipleChoiceItem()
      .setTitle('Do you currently have a website?')
      .setRequired(true)
      .setChoiceValues([
        'Yes — and it needs to stay up while we build the new one',
        'Yes — but it\'s outdated or broken and I\'m fine replacing it',
        'No — I don\'t have one yet'
      ]);

  form.addTextItem()
      .setTitle('If yes — what is the URL of your current website?')
      .setRequired(false)
      .setHelpText('e.g. https://mybusiness.com — leave blank if you don\'t have one');


  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 2 — YOUR PROJECT
  // ══════════════════════════════════════════════════════════════════════════

  form.addPageBreakItem()
      .setTitle('Part 2 of 5 — Your Project')
      .setHelpText('Tell us what you\'re trying to build or fix. Plain language is fine — we\'ll work out the details together.');

  form.addListItem()
      .setTitle('Which of these best describes what you\'re looking for?')
      .setRequired(true)
      .setChoiceValues([
        'A brand new website (I don\'t have one, or I need to start completely over)',
        'A simple business website — just a few pages, no regular updates needed',
        'A business website I can update myself (with a content management system)',
        'A larger website with a blog, multiple sections, and stronger content strategy',
        'A web application or custom software tool (something more than a website)',
        'Improvements or additions to something that already exists',
        'Help with digital marketing, content, or SEO',
        'I\'m not sure yet — I need help figuring that out'
      ]);

  form.addMultipleChoiceItem()
      .setTitle('Do you already have a logo and brand colors?')
      .setRequired(true)
      .setChoiceValues([
        'Yes — I have a complete logo and brand guidelines',
        'Yes — I have a logo but nothing else',
        'No — I need these created as part of this project',
        'Not sure what I have'
      ]);

  form.addMultipleChoiceItem()
      .setTitle('Do you have the text (copy) for your project already written?')
      .setRequired(true)
      .setHelpText('Text = the words on your website pages, about section, service descriptions, etc.')
      .setChoiceValues([
        'Yes — it\'s written and approved, ready to use',
        'Partially — some is done but we\'d need help finishing it',
        'No — we\'d need someone to write it from scratch',
        'Not sure yet'
      ]);

  form.addMultipleChoiceItem()
      .setTitle('Do you need your website or materials in more than one language?')
      .setRequired(true)
      .setChoiceValues([
        'Yes — English and Spanish',
        'Yes — English and another language (specify in notes at the end)',
        'No — English only',
        'Not sure yet'
      ]);

  form.addCheckboxItem()
      .setTitle('Does your project involve any of the following? (Select all that apply)')
      .setRequired(false)
      .setHelpText('This helps us flag any extra requirements early.')
      .setChoiceValues([
        'Online payments or e-commerce (selling products or services)',
        'Patient records or health information (HIPAA applies)',
        'Collecting personal data from customers (privacy laws apply)',
        'User accounts, logins, or a members-only area',
        'Online booking, scheduling, or reservations',
        'Connecting to existing software (e.g. your CRM, payment processor)',
        'None of the above',
        'Not sure'
      ]);

  form.addParagraphTextItem()
      .setTitle('In your own words — what is the main problem you want to solve?')
      .setRequired(true)
      .setHelpText(
        'Don\'t use technical language — just describe the situation. ' +
        'e.g. "Our website looks old and customers tell us it\'s hard to find our phone number" or ' +
        '"We lose clients because we can\'t take bookings online."'
      );

  form.addParagraphTextItem()
      .setTitle('How will you know the project was successful? What would look different?')
      .setRequired(true)
      .setHelpText(
        'e.g. "Customers can book appointments without calling us" or ' +
        '"We show up on Google when people search for our services."'
      );

  form.addParagraphTextItem()
      .setTitle('Who are the people this project is meant to reach or serve?')
      .setRequired(false)
      .setHelpText('e.g. Local homeowners in Miami, small business owners who need payroll help, patients over 60.');


  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 3 — TIMELINE & BUDGET
  // ══════════════════════════════════════════════════════════════════════════

  form.addPageBreakItem()
      .setTitle('Part 3 of 5 — Timeline & Budget')
      .setHelpText('Knowing your timeline and budget helps us suggest an approach that actually fits your situation.');

  form.addListItem()
      .setTitle('When would you like to get started?')
      .setRequired(true)
      .setChoiceValues([
        'As soon as possible',
        'Within the next month',
        'Within the next 3 months',
        'Within the next 6 months',
        'No rush — I\'m still in the planning stage'
      ]);

  form.addMultipleChoiceItem()
      .setTitle('Do you have a hard deadline this must be finished by?')
      .setRequired(true)
      .setChoiceValues([
        'Yes — there is a specific date or event it must be ready for',
        'No — the timeline is flexible',
        'Not sure yet'
      ]);

  form.addTextItem()
      .setTitle('If yes — what is the deadline, event, or launch date?')
      .setRequired(false)
      .setHelpText('e.g. "Trade show on October 15" or "Product launch in Q4 2026"');

  form.addMultipleChoiceItem()
      .setTitle('What is your rough budget for this project?')
      .setRequired(true)
      .setHelpText('This is kept completely confidential and is only used to make sure we suggest an approach that fits.')
      .setChoiceValues([
        'Under $2,500',
        '$2,500 – $5,000',
        '$5,000 – $15,000',
        '$15,000 – $30,000',
        '$30,000 – $50,000',
        '$50,000 or more',
        'I\'d rather not share this right now'
      ]);

  form.addMultipleChoiceItem()
      .setTitle('Is your budget already approved and available?')
      .setRequired(true)
      .setChoiceValues([
        'Yes — it\'s set aside and approved',
        'Partially — I\'m still working on getting full approval',
        'No — budget conversations haven\'t started yet',
        'Not sure'
      ]);

  form.addListItem()
      .setTitle('How would you prefer to structure payments?')
      .setRequired(false)
      .setHelpText('All options are available — this helps us structure the proposal.')
      .setChoiceValues([
        'Half upfront, half at the end',
        'Split into three milestones (deposit / mid-point / delivery)',
        'Monthly payments over the project duration',
        'I\'d like to discuss this',
        'Not sure yet'
      ]);


  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 4 — DECISION MAKING
  // ══════════════════════════════════════════════════════════════════════════

  form.addPageBreakItem()
      .setTitle('Part 4 of 5 — Decision Making & Communication')
      .setHelpText('Understanding who makes decisions helps us avoid unnecessary delays and communicate effectively.');

  form.addMultipleChoiceItem()
      .setTitle('Are you the person who will make the final decision on this project?')
      .setRequired(true)
      .setChoiceValues([
        'Yes — I have full authority to approve and move forward',
        'No — someone else has the final say',
        'It\'s a shared decision between two or more people'
      ]);

  form.addTextItem()
      .setTitle('If someone else approves — who is that person and what is their role?')
      .setRequired(false)
      .setHelpText('e.g. "Jane Smith, CEO" — leave blank if you answered Yes above');

  form.addMultipleChoiceItem()
      .setTitle('How many people need to approve the work we deliver?')
      .setRequired(true)
      .setChoiceValues([
        'Just me',
        '2–3 people',
        '4 or more people'
      ]);

  form.addListItem()
      .setTitle('How would you prefer we communicate with you during the project?')
      .setRequired(true)
      .setChoiceValues([
        'Email',
        'Video calls (Zoom or Google Meet)',
        'Phone calls',
        'Slack or Microsoft Teams',
        'A project management tool (like Notion or Asana)',
        'No preference'
      ]);

  form.addListItem()
      .setTitle('How often would you like progress updates from us?')
      .setRequired(true)
      .setChoiceValues([
        'Every day',
        'Every 2–3 days',
        'Once a week',
        'Every two weeks',
        'Only when something important happens'
      ]);


  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 5 — FINAL QUESTIONS
  // ══════════════════════════════════════════════════════════════════════════

  form.addPageBreakItem()
      .setTitle('Part 5 of 5 — A Few Final Questions')
      .setHelpText('Almost done. These last questions help us serve you better from day one.');

  form.addMultipleChoiceItem()
      .setTitle('Have you worked with a web agency or developer on a project like this before?')
      .setRequired(true)
      .setChoiceValues([
        'Yes — and it went well',
        'Yes — but I was not satisfied with the result',
        'Yes — mixed results',
        'No — this would be my first time'
      ]);

  form.addParagraphTextItem()
      .setTitle('If you\'ve worked with agencies before — what went wrong or felt frustrating?')
      .setRequired(false)
      .setHelpText(
        'e.g. "They went quiet for weeks," "The price went up unexpectedly," ' +
        '"The result didn\'t match what we discussed." — Leave blank if this is your first time.'
      );

  form.addListItem()
      .setTitle('How did you hear about NoDrftSystems?')
      .setRequired(false)
      .setChoiceValues([
        'Referral from a colleague or client',
        'LinkedIn',
        'Web search',
        'Direct outreach from NoDrftSystems',
        'Event or conference',
        'Other'
      ]);

  form.addTextItem()
      .setTitle('Who referred you? (if someone did)')
      .setRequired(false)
      .setHelpText('Their name or business name — leave blank if not applicable');

  form.addParagraphTextItem()
      .setTitle('Is there anything else you\'d like us to know before we connect?')
      .setRequired(false)
      .setHelpText('Anything at all — about your business, your priorities, or what\'s most important to you.');


  // ── Output ───────────────────────────────────────────────────────────────
  var formUrl  = form.getPublishedUrl();
  var editUrl  = form.getEditUrl();
  var shortUrl = form.shortenFormUrl(formUrl);

  Logger.log('');
  Logger.log('=== FORM CREATED SUCCESSFULLY ===');
  Logger.log('');
  Logger.log('Share with clients: ' + shortUrl);
  Logger.log('Edit / manage:      ' + editUrl);
  Logger.log('');
  Logger.log('=== REQUIRED NEXT STEPS ===');
  Logger.log('');
  Logger.log('1. Open the edit URL above and click the gear icon (Settings).');
  Logger.log('');
  Logger.log('2. Under the RESPONSES tab:');
  Logger.log('   [x] Collect email addresses — ALREADY ON (set by this script)');
  Logger.log('   [x] Send respondents a copy of their responses — TURN THIS ON');
  Logger.log('   [x] Get email notifications for new responses — TURN THIS ON');
  Logger.log('       (Notifications go to the Google account running this script.)');
  Logger.log('');
  Logger.log('3. Under the PRESENTATION tab:');
  Logger.log('   — Review the confirmation message. Edit it if needed.');
  Logger.log('   — Show a progress bar: ALREADY ON.');
  Logger.log('');
  Logger.log('4. Connect to Google Sheets to capture all submissions in a spreadsheet:');
  Logger.log('   — Open the form editor > click the Responses tab at the top.');
  Logger.log('   — Click the green Sheets icon > Create a new spreadsheet.');
  Logger.log('   — Name it "NoDrftSystems Intake Responses — [date]".');
  Logger.log('');
  Logger.log('5. Share the short URL with clients: ' + shortUrl);
  Logger.log('');
  Logger.log('=== OPTIONAL: AUTO-FORWARD EMAIL TO A DIFFERENT ADDRESS ===');
  Logger.log('');
  Logger.log('If you want responses emailed to a different address than the Google account,');
  Logger.log('run the addEmailTrigger() function below and update the email address inside it.');
  Logger.log('');
}


/**
 * OPTIONAL — Run this separately if you want submission emails forwarded to a
 * specific address. Defaults to the primary intake address.
 *
 * To use: confirm the target email below, then run addEmailTrigger().
 */
function addEmailTrigger() {
  var TARGET_EMAIL = 'info@nodrftsystems.com';

  // Get the most recently created form owned by this account
  var forms = DriveApp.getFilesByMimeType('application/vnd.google-apps.form');
  var latestForm = null;
  var latestDate = new Date(0);

  while (forms.hasNext()) {
    var file = forms.next();
    if (file.getDateCreated() > latestDate) {
      latestDate = file.getDateCreated();
      latestForm = file;
    }
  }

  if (!latestForm) {
    Logger.log('No form found. Run createIntakeForm() first.');
    return;
  }

  var formId = latestForm.getId();

  // Set up an onFormSubmit trigger
  ScriptApp.newTrigger('onIntakeSubmit')
           .forForm(formId)
           .onFormSubmit()
           .create();

  // Store the target email in script properties
  PropertiesService.getScriptProperties().setProperty('NOTIFY_EMAIL', TARGET_EMAIL);

  Logger.log('Trigger created. Submissions will be forwarded to: ' + TARGET_EMAIL);
}


/**
 * Triggered on each form submission. Emails a formatted summary to NOTIFY_EMAIL.
 * This function is called automatically — do not run it manually.
 */
function onIntakeSubmit(e) {
  var notifyEmail = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!notifyEmail) return;

  var response   = e.response;
  var items      = e.source.getItems();
  var itemResponses = response.getItemResponses();
  var submitted  = response.getTimestamp();

  var lines = [
    'NoDrftSystems — New Client Intake Submission',
    'Submitted: ' + submitted.toLocaleString(),
    '─────────────────────────────────────────────',
    ''
  ];

  itemResponses.forEach(function(r) {
    var q = r.getItem().getTitle();
    var a = r.getResponse();
    if (Array.isArray(a)) a = a.join(', ');
    if (a && a.toString().trim() !== '') {
      lines.push('Q: ' + q);
      lines.push('A: ' + a);
      lines.push('');
    }
  });

  lines.push('─────────────────────────────────────────────');
  lines.push('Respond within 1–2 business days.');
  lines.push('NoDrftSystems Intake System');

  var subject = 'New Intake: ' + (itemResponses[1] ? itemResponses[1].getResponse() : 'Client') +
                ' — ' + submitted.toLocaleDateString();

  MailApp.sendEmail({
    to:      notifyEmail,
    subject: subject,
    body:    lines.join('\n')
  });
}
