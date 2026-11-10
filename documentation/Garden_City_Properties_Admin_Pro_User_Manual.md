# GARDEN CITY PROPERTIES
## ADMIN PRO DASHBOARD — CLIENT USER MANUAL
### Website Content Management & Property Administration Guide

---

**Official Production Website**: [https://www.gardencityproperties.net/](https://www.gardencityproperties.net/)  
**Administrative Portal**: [https://www.gardencityproperties.net/admin/](https://www.gardencityproperties.net/admin/)  
**Administrative Login**: [https://www.gardencityproperties.net/admin/login/](https://www.gardencityproperties.net/admin/login/)  
**Document Version**: 2.4 (Enterprise Edition)  
**Publication Date**: November 2026  
**Audience**: Garden City Properties Executive Leadership, Sales Management, and Content Administrators  

---

## TABLE OF CONTENTS

1. **Part 1 — Introduction & System Architecture**
   - 1.1 What the Admin Pro Dashboard Is
   - 1.2 What You Can Manage Independently
   - 1.3 How Public Website Updates Work
   - 1.4 When Technical / Developer Support Is Required
   - 1.5 How the Website Backend & Supabase Work Together
2. **Part 2 — Admin Login & Session Security**
   - 2.1 Opening the Admin Login Screen
   - 2.2 Entering Administrator Credentials
   - 2.3 Signing Out Safely
   - 2.4 Troubleshooting Login Failures
   - 2.5 Session Expiration & Refreshing
3. **Part 3 — Admin Dashboard Overview**
   - 3.1 Top Header & System Status Bar
   - 3.2 Action Toolbar & Live Project Counters
   - 3.3 Live Properties Inventory Cards
   - 3.4 10-Point Readiness & Completeness Checklist
   - 3.5 The 10-Section Property Management Form
4. **Part 4 — Adding a New Property Development (Step-by-Step)**
   - 4.1 Required Fields
   - 4.2 Recommended Fields
   - 4.3 Optional Fields
   - 4.4 Difference Between "Publish New Development" and "Save All Changes"
5. **Part 5 — Image & Media Upload Guide**
   - 5.1 Supported Image Formats vs. Unsupported Formats (The .ICO Rule)
   - 5.2 Recommended Dimensions & Aspect Ratios
   - 5.3 File Sizes & 40 MB Total Project Media Cap
   - 5.4 Automatic Client-Side WebP Compression
   - 5.5 Replacing and Removing Existing Images
   - 5.6 Verifying Public Website Updates
6. **Part 6 — Property Configurations (Unit Typologies & Visual Cards)**
   - 6.1 Adding Villas, Apartments, Studios, and Penthouses
   - 6.2 Uploading Individual Unit Photographs & Galleries
   - 6.3 Configuring Bedrooms, Bathrooms, BUA, Plot Area, and Pricing
   - 6.4 Marking Configurations as "Featured"
   - 6.5 Managing Availability Status
   - 6.6 Reordering and Deleting Configurations
   - 6.7 How Visual Cards and the Interactive Modal Appear to Website Visitors
7. **Part 7 — Investment & Payment Plan Management**
   - 7.1 Enabling / Disabling the Investment Section
   - 7.2 Customizing English & Arabic Section Headings
   - 7.3 Adding, Editing, and Reordering Payment Milestones
   - 7.4 Selecting Milestone Icons
   - 7.5 Independent Bank Mortgage Financing Card
   - 7.6 Critical Financial & Legal Accuracy Warning
8. **Part 8 — Amenities & Curated Facilities**
   - 8.1 Enabling / Disabling the Amenities Section
   - 8.2 Curated 1-Click Luxury Lifestyle Amenities
   - 8.3 Creating Custom Project-Specific Amenities
   - 8.4 Selecting Iconography & Category Classifications
   - 8.5 Public Project Page Presentation
9. **Part 9 — Cinematic Video Walkthroughs**
   - 9.1 Supported Video Providers & Formats (YouTube & Direct MP4)
   - 9.2 Step-by-Step Guide to Uploading to YouTube (Public vs. Unlisted)
   - 9.3 Why Google Drive Links Are Not Supported for Streaming
   - 9.4 Pasting and Verifying the Video in Admin Pro
10. **Part 10 — Location Intelligence & Nearby Attractions**
    - 10.1 Google Maps URL Entry & Auto-Resolution of Coordinates
    - 10.2 Manual Address, City, Country, and Coordinate Overrides
    - 10.3 Adding Key Nearby Destinations & Travel Times
    - 10.4 Interactive Map & Landmark Cards on the Public Page
11. **Part 11 — Editing Existing Projects (Safe Update Workflow)**
    - 11.1 Loading an Existing Project into Edit Mode
    - 11.2 Updating Prices, Descriptions, and Typologies
    - 11.3 How to Avoid Accidentally Overwriting or Deleting Existing Photos
    - 11.4 Saving Changes & Confirming Live Website Synchronization
12. **Part 12 — Common Errors & Troubleshooting**
    - 12.1 Error: "MIME type image/x-icon is not supported"
    - 12.2 Error: "Total media size exceeds 40MB limit"
    - 12.3 Issue: Changes Not Appearing Immediately on the Public Website
    - 12.4 Issue: YouTube Video Shows Black Screen or "Embedding Disabled"
    - 12.5 Issue: Google Maps Coordinate Resolution Fails
    - 12.6 Session Expired / Authentication Errors
13. **Part 13 — Professional Real Estate Best Practices**
    - 13.1 High-Conversion Luxury Architectural Photography
    - 13.2 File Naming Conventions
    - 13.3 Accurate Pricing & Currency Standards (OMR)
    - 13.4 Bilingual Excellence (English & Arabic)
    - 13.5 Pre-Publishing Audit
14. **Part 14 — Client Responsibilities vs. Developer Responsibilities**
    - 14.1 Tasks the Client Manages Independently
    - 14.2 Operations Requiring Technical / Developer Support
15. **Part 15 — Final 10-Point Pre-Publishing Checklist**

---

## PART 1 — INTRODUCTION & SYSTEM ARCHITECTURE

Welcome to **Garden City Properties Admin Pro** — your proprietary enterprise management portal engineered specifically for managing luxury property developments across the Sultanate of Oman.

### 1.1 What the Admin Pro Dashboard Is
Admin Pro is a private, cloud-connected web application accessible through any desktop or tablet browser. It provides your sales, marketing, and executive team with complete control over the developments presented on **gardencityproperties.net**.

You do not need programming knowledge, code editors, or server management skills to operate Admin Pro. Every real estate detail — from high-resolution cover photos and payment milestones to villa configurations and Google Maps locations — can be managed through structured visual forms.

### 1.2 What You Can Manage Independently
As an authorized Garden City Properties administrator, you have full independent authority over:
- **Inventory Management**: Adding new master developments, publishing upcoming launches, updating existing projects, and archiving or deleting completed phases.
- **Visual Branding & Photography**: Uploading primary project cover photos, managing multi-image photography galleries, and uploading individual photographs for specific property configurations.
- **Commercial & Financial Terms**: Setting starting prices (in OMR), describing payment plan structures, configuring step-by-step milestone schedules, and setting up bank mortgage eligibility cards.
- **Unit Typologies (Configurations)**: Defining specific villas, townhouses, penthouses, and 1–4 bedroom apartments with their exact bedroom counts, bathroom counts, Built-Up Area (BUA in sqm), plot sizes, and individual availability.
- **Lifestyle Amenities**: Selecting from 12 curated luxury amenities or creating custom development-specific privileges with dedicated iconography.
- **Cinematic Media & Brochures**: Linking high-definition YouTube video tours and linking official downloadable PDF brochures.
- **Location Intelligence**: Setting Google Maps links, auto-resolving geographical coordinates, and defining distances to Muscat International Airport, beaches, malls, and schools.

### 1.3 How Public Website Updates Work
When you click **"Save All Changes to Project"** or **"Publish New Development"**, Admin Pro sends your updates directly to the Supabase cloud database. 

Because the Garden City Properties public website uses **Dynamic On-Demand Rendering**, the public project pages immediately query the database upon every visitor request. **Your updates appear on the public website within seconds** without needing technical recompilation or server redeployment.

### 1.4 When Technical / Developer Support Is Required
Certain low-level architectural operations remain outside the dashboard and require certified developer assistance:
- Creating brand-new database tables or changing column types in Supabase.
- Modifying website domain routing, DNS records, or SSL certificates on Netlify.
- Adding completely new visual layouts, animated sections, or custom frontend widgets that do not currently exist in the design system.
- Modifying backend serverless functions, email sending services (Web3Forms/SMTP), or authentication security policies.

### 1.5 How the Website Backend & Supabase Work Together
To understand how your system operates, imagine a luxury hotel with three interconnected areas:
1. **The Public Showcase (The Hotel Lobby & Suites)**: This is what property buyers and global investors see when visiting `gardencityproperties.net`. It is fast, elegant, responsive, and bilingual (English and Arabic).
2. **The Secure Vault (The Supabase Cloud Database & Storage)**: This is the ultra-secure cloud database hosted on Supabase. It stores your text records in PostgreSQL tables and your high-resolution images in dedicated storage buckets (`property-images`).
3. **The Control Room (Admin Pro Dashboard)**: This is your private administrative interface at `/admin/`. It reads from the vault, displays your current inventory, and writes your new entries safely into the vault.

```
┌─────────────────────────────────┐
│     Admin Pro Dashboard         │  <--- Your team enters prices,
│     (/admin/)                   │       photos, and unit details
└────────────────┬────────────────┘
                 │ Secure SSL (Authenticated)
                 ▼
┌─────────────────────────────────┐
│     Supabase Cloud Vault        │  <--- Bank-grade PostgreSQL database
│     (Database & Media Bucket)   │       and encrypted media storage
└────────────────┬────────────────┘
                 │ Real-Time Dynamic Queries
                 ▼
┌─────────────────────────────────┐
│     Public Production Website   │  <--- Global investors view luxury
│     (gardencityproperties.net)  │       development presentations
└─────────────────────────────────┘
```

---

## PART 2 — ADMIN LOGIN & SESSION SECURITY

### 2.1 Opening the Admin Login Screen
1. Open any modern desktop or tablet web browser (Google Chrome, Safari, Microsoft Edge, or Mozilla Firefox).
2. Navigate to:
   ```
   https://www.gardencityproperties.net/admin/login
   ```
   *(Note: If you navigate to `https://www.gardencityproperties.net/admin/` while logged out, the system automatically redirects you to the login screen).*

### 2.2 Entering Administrator Credentials
1. On the login card, enter your authorized **Administrator Email Address**.
2. Enter your secure **Password**.
3. Click the cyan **"Sign In to Dashboard"** button.
4. The system validates your credentials against Supabase Auth. Upon successful verification, you are immediately routed into the Admin Pro dashboard.

> **Security Note**: Never share your administrator password over email or messaging apps. Garden City Properties administrators have full write permissions across the property portfolio.

### 2.3 Signing Out Safely
When finished managing developments, always sign out to prevent unauthorized access on shared devices:
1. Locate the top navigation header at the top right of the dashboard.
2. Click the red **"Sign Out"** button (accompanied by the logout icon).
3. Your local authentication token is immediately cleared from the browser, and you are returned to the login screen.

### 2.4 Troubleshooting Login Failures
If you receive an error message upon clicking Sign In:
- **"Invalid login credentials"**: Verify that Caps Lock is disabled and check for accidental spaces before or after your email address.
- **"Email not confirmed"**: The administrator account has been created in Supabase but requires email confirmation before the first login.
- **Network / Connection Issues**: Ensure your computer has an active internet connection.
- **Forgotten Password**: Contact your technical administrator to generate a secure password reset link directly from the Supabase Authentication console.

### 2.5 Session Expiration & Refreshing
Admin Pro maintains your session token in your browser's encrypted local storage with automatic background token refreshes. However, if your session token expires after prolonged inactivity or if your browser cache is cleared, Admin Pro will prompt you to log in again. Your saved database records will never be affected by an expired session.

---

## PART 3 — ADMIN DASHBOARD OVERVIEW

The Admin Pro dashboard is divided into five high-level zones designed for maximum clarity:

```
┌────────────────────────────────────────────────────────────────────────┐
│ ZONE 1: TOP HEADER & STATUS BAR (Logo | Status | Public Link | Sign Out)│
├────────────────────────────────────────────────────────────────────────┤
│ ZONE 2: TOOLBAR (Content Guide | Refresh Database | Live Counters)    │
├────────────────────────────────────────────────────────────────────────┤
│ ZONE 3: LIVE INVENTORY BAR (Scrollable Cards of All Published Projects)│
├────────────────────────────────────────────────────────────────────────┤
│ ZONE 4: COMPLETENESS CHECKLIST (10-Point Readiness Verification Bar)   │
├────────────────────────────────────────────────────────────────────────┤
│ ZONE 5: 10-SECTION EDITING & CREATION WORKBENCH                        │
│   Section 1: Basic Project Information                                │
│   Section 2: Project Overview & Narrative                              │
│   Section 3: Property Types & Available Units (Configurations)         │
│   Section 4: Property Location & Nearby Places                         │
│   Section 5: Investment & Payment Plan                                 │
│   Section 6: Amenities & Facilities                                    │
│   Section 7: Project Gallery & Media Management                        │
│   Section 8: Architectural Floor Plans                                 │
│   Section 9: Videos & Digital Brochures                                │
│   Section 10: SEO & Publishing Controls                                │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Top Header & System Status Bar
- **Brand Logo & Title**: Displays the official Garden City Properties crest and "Admin Pro Portal" insignia.
- **Live Database Connection**: A glowing green indicator (`● Connected to Supabase`) confirming active communication with the cloud database.
- **View Live Website Link**: Quick-access link (`View Live Website ↗`) opening the public website in a new tab.
- **Sign Out Button**: Immediate session termination.

### 3.2 Action Toolbar & Live Project Counters
- **"Content & Best Practices Guide" Button**: Opens an interactive slide-over guide with field-by-field instructions, character limits, and real estate marketing tips.
- **"Refresh Database" Button**: Instantly re-fetches all records from Supabase, updating your local dashboard view if another team member made changes.
- **Live Inventory Counter**: Shows the total count of active property developments currently stored in the database.

### 3.3 Live Properties Inventory Cards
Directly beneath the toolbar is the **Live Properties** showcase. Every development in your database appears here as a summary card showing:
- Cover photograph thumbnail.
- Project Title and Master Developer.
- Starting Price (OMR) and Location.
- Status badge (`Published` in cyan or `Draft` in amber).
- **Edit Button (Pencil Icon)**: Loads this project into the 10-section workbench below for editing.
- **Preview Link (Eye Icon)**: Opens this project's dedicated live page on the public website.
- **Delete Button (Trash Icon)**: Allows removing the project after a confirmation prompt.

### 3.4 10-Point Readiness & Completeness Checklist
Located above the workbench, this interactive bar tracks your project's readiness across 10 critical dimensions:
1. Basic Information (Name, Developer, Price, Area)
2. Media Cover (Primary photograph uploaded)
3. Narrative & Story (Editorial description populated)
4. Unit Typologies (At least 1 unit configuration created)
5. Location & Map (Google Maps link and address set)
6. Payment Milestones (Payment steps configured)
7. Curated Amenities (Lifestyle privileges selected)
8. Architectural Floor Plans (Blueprint image or URL set)
9. Cinematic Media (YouTube video walkthrough linked)
10. SEO & Publishing (Custom slug and publishing status active)

Clicking any item in the checklist instantly scrolls your screen to that exact section.

---

## PART 4 — ADDING A NEW PROPERTY DEVELOPMENT (STEP-BY-STEP)

When you open Admin Pro, the form defaults to **"Add New Development"** mode. Follow these steps to publish a new real estate project:

### 4.1 Required Fields
You must populate these fields before publishing:
1. **Project Name** *(Section 1)*: The official marketing name of the development (e.g., `Sultan Haitham City`, `AIDA Muscat`, `The Marina Residences`).
2. **Master Developer** *(Section 1)*: The reputable master developer (e.g., `Ministry of Housing & Urban Planning`, `Dar Al Arkan`, `Garden City Properties`).
3. **Starting Price** *(Section 1)*: The lowest entry price for marketing displays (e.g., `OMR 45,000`, `OMR 125,000`, or `Price on Application`).
4. **Starting Area** *(Section 1)*: The entry-level size (e.g., `From 85 m²`, `120 m² – 450 m²`).
5. **Payment Plan Summary** *(Section 1)*: High-level financial overview (e.g., `20% Down / 80% On Handover`, `10% Booking / 5-Year Flexible Milestones`).
6. **Primary Cover Image** *(Section 7)*: High-resolution visual cover photo representing the project on cards, heroes, and search previews.

### 4.2 Recommended Fields
These fields significantly elevate project presentation and investor conversion:
- **Project Typology** *(Section 1)*: Dropdown selecting `Master Community`, `Residential`, `Villas`, `Mixed-Use`, `Waterfront`, or `Luxury Penthouse`.
- **Construction Stage** *(Section 1)*: Dropdown selecting `Off-Plan Launch`, `Groundbreaking & Foundations`, `Under Active Construction`, `Near Handover`, or `Completed & Ready`.
- **Handover Date** *(Section 1)*: Expected completion date (e.g., `Q4 2026`, `December 2027`).
- **Structure / Finishes** *(Section 1)*: Architectural specifications (e.g., `Contemporary Luxury Architectural Finishes`, `Italian Porcelain & Smart Glass`).
- **Editorial Story / Narrative Description** *(Section 2)*: A comprehensive 2-to-4 paragraph narrative detailing the architectural vision, lifestyle benefits, and capital appreciation potential.
- **Property Configurations** *(Section 3)*: At least 2 to 4 specific unit typologies (e.g., 1-BR Apartment, 2-BR Suite, 4-BR Signature Villa).
- **Google Maps Link** *(Section 4)*: Clean Google Maps link pinpointing the site in Oman.
- **Payment Milestones** *(Section 5)*: Specific milestone steps (Booking, Foundation, Superstructure, Handover).
- **Amenities & Facilities** *(Section 6)*: Checked lifestyle features (Swimming pool, gym, 24/7 security).
- **High-Res Gallery Slideshow** *(Section 7)*: 4 to 8 high-resolution photos of facades, interiors, and landscaping.

### 4.3 Optional Fields
- **Custom URL Slug** *(Section 10)*: A clean SEO web address (e.g., `sultan-haitham-city`). If left blank, Admin Pro automatically generates it from the project name.
- **Cinematic YouTube Video Walkthrough** *(Section 9)*: A YouTube video tour of the project.
- **Architectural Floor Plan Image** *(Section 8)*: Blueprint diagram of the master layout.
- **Official Digital PDF Brochure URL** *(Section 9)*: Downloadable sales brochure link.
- **Bank Mortgage Financing Card** *(Section 5)*: List of approved Omani commercial banks.

### 4.4 Difference Between "Publish New Development" and "Save All Changes"
- **"Publish New Development"**:
  - Visible when you are adding a fresh property.
  - Generates a new database record with a unique ID and URL slug.
  - Immediately lists the property on the homepage and projects catalog.
- **"Save All Changes to Project"**:
  - Visible only when you click **"Edit"** on an existing project card.
  - Displays an amber banner at the top: `Editing Project: [Name] (Updating ID: [slug])`.
  - Updates the existing database record in place without changing its URL, preserving all visitor bookmarks and search engine indexation.

---

## PART 5 — IMAGE & MEDIA UPLOAD GUIDE

Images are the single most influential asset on a luxury real estate website. Admin Pro provides dedicated upload controls for each category of visual media.

### 5.1 Supported Formats vs. The .ICO Rule
- **Supported Formats**: `.jpg`, `.jpeg`, `.png`, and `.webp`.
- **Strictly Unsupported**: `.ico` (Windows Icon files).

> **Important**: Never upload `.ico` files. An `.ico` file is a tiny icon used for Windows desktop shortcuts. If uploaded, Supabase Storage will reject it with the error: `MIME type image/x-icon is not supported`. Admin Pro includes an automatic security check that inspects binary file headers and blocks `.ico` files before upload. Always upload standard JPG, PNG, or WebP photographs.

### 5.2 Recommended Dimensions & Aspect Ratios
| Image Type | Recommended Aspect Ratio | Optimal Resolution | Recommended Usage |
| :--- | :---: | :---: | :--- |
| **Main Project Cover** | 16:9 (Widescreen) | 1920 × 1080 px | Project hero banner & catalog showcase cards |
| **Photography Gallery** | 16:9 (Widescreen) | 1920 × 1080 px | Fullscreen lightbox slideshow & community views |
| **Configuration (Unit) Cover** | 16:9 or 4:3 | 1600 × 900 px | Individual villa / apartment visual cards |
| **Configuration Gallery** | 16:9 or 4:3 | 1600 × 900 px | Unit interior modal (master bedroom, living room) |
| **Architectural Floor Plans** | Landscape or 4:3 | 2000 × 1500 px | Blueprint viewer & zoom modal |

### 5.3 File Sizes & 40 MB Total Project Media Cap
- **Individual Photo Target**: Between `500 KB` and `3.5 MB`.
- **Total Project Media Cap**: Admin Pro enforces a generous **40 MB ceiling** per project across all staged images. This prevents mobile network congestion for your website visitors while accommodating dozens of high-definition images.

### 5.4 Automatic Client-Side WebP Compression
Admin Pro incorporates an automated client-side canvas compressor (`compressImageFile`). When you select high-resolution JPG or PNG files over `500 KB`, Admin Pro automatically:
1. Re-samples the image down to a maximum dimension of `2048 px`.
2. Encodes the image into Google WebP format at 82%–85% studio quality.
3. Reduces file size by up to 70% with zero perceptible loss in visual clarity.
4. Uploads the optimized WebP file directly to Supabase Storage.

### 5.5 Replacing and Removing Existing Images
- **To Replace the Main Project Cover**:
  In Section 7 (*Project Gallery & Media Management*), click the cyan **"Replace Cover Image"** button. Select your new photo. The preview updates immediately.
- **To Remove Individual Gallery Photos**:
  In the Gallery preview grid, hover over any existing thumbnail. A red trash icon appears in the top corner. Click it to remove that specific photo from the project.
- **To Remove a Configuration Image**:
  Open the configuration modal in Section 3, and click the red **"Remove Photo"** button under the unit preview.

### 5.6 Verifying Public Website Updates
After clicking **"Save All Changes to Project"**, verify the updates:
1. Click the **"Preview"** link on the project card.
2. The public page opens in a new tab.
3. If your browser displays the older image, perform a hard refresh:
   - **Windows / Chrome / Edge**: Press `Ctrl + F5`
   - **Mac / Safari / Chrome**: Press `Cmd + Shift + R`

---

## PART 6 — PROPERTY CONFIGURATIONS (UNIT TYPOLOGIES & VISUAL CARDS)

In luxury real estate, buyers do not simply purchase a development — they purchase a specific home: a 2-bedroom executive apartment, a 4-bedroom beachfront villa, or a duplex penthouse. Section 3 allows you to define every available layout with its own photography and specifications.

### 6.1 Adding Villas, Apartments, Studios, and Penthouses
1. Navigate to **Section 3: Property Types & Available Units**.
2. Click the cyan **"+ Add Configuration"** button.
3. The **Add Property Configuration Modal** opens:
   - **Property Type**: Select `Apartment`, `Villa`, `Townhouse`, `Penthouse`, `Duplex`, `Studio`, `Plot`, or `Commercial`.
   - **Configuration Name (English)**: Enter a descriptive title (e.g., `4-Bedroom Signature Beachfront Villa`, `2-Bedroom Executive Horizon Suite`).
   - **Arabic Name (Optional)**: Enter the Arabic title (e.g., `فيلا سيجنتشر 4 غرف نوم على الشاطئ`).
   - **Bedrooms**: Enter number of bedrooms (`0` for Studio, `1` to `7` for residences).
   - **Bathrooms**: Enter bathrooms (e.g., `2`, `3.5`, `5`).
   - **Balconies**: Enter number of private balconies or terraces.
   - **Built-Up Area (BUA sqm)**: Enter built-up size (e.g., `128`, `340`).
   - **Plot Area (sqm)**: For villas or townhouses, enter land plot area (e.g., `450`).
   - **Unit Price**: Specific unit price (e.g., `OMR 85,000`, `From OMR 240,000`).
   - **Furnishing Status**: Select `Unfurnished`, `Semi-furnished`, or `Fully furnished`.
   - **Parking Info**: Describe parking provision (e.g., `2 Covered Basement Spaces`).
   - **Configuration Summary**: A brief paragraph highlighting the layout's distinctive features (e.g., floor-to-ceiling glass, Italian fitted kitchen, private pool provision).

### 6.2 Uploading Individual Unit Photographs & Galleries
Inside the Configuration Modal:
1. **Main Unit Cover Photo**:
   - Click the upload box under **"Unit Photography & Media"**.
   - Select a photo representing this specific layout (exterior render of the villa, or living room view of the apartment).
   - You can replace or remove this photo at any time.
   - Alternatively, paste a hosted image URL into the direct URL field.
2. **Additional Unit Gallery Photos**:
   - Click **"+ Add Photos"** to upload supplemental photos for this specific unit (e.g., master bedroom, en-suite bathroom, terrace vista).
   - Thumbnails appear in a grid with individual delete buttons.

### 6.3 Marking Configurations as "Featured"
Tick the checkbox: **"Mark as Featured Configuration"**. This displays a prestigious gold **`★ Featured`** badge on the public card and places it prominently in marketing previews.

### 6.4 Managing Availability Status
Select from the Availability dropdown:
- **Available**: Actively open for reservation (displays in emerald green).
- **Limited availability**: Few units remain (displays in amber).
- **Sold out**: Unit typology is fully booked (displays in red).
- **Coming soon**: Future phase release (displays in blue).

### 6.5 Reordering and Deleting Configurations
- **Reordering**: Use the **Up** and **Down** chevron buttons next to any configuration in the list to change the order in which they appear on the website.
- **Editing**: Click the pencil icon to reopen the modal and modify specifications or photos.
- **Deleting**: Click the red trash icon to remove a configuration.

### 6.6 How Visual Cards and the Interactive Modal Appear to Website Visitors
On the public project details page:
1. **Visual Cards Grid**: Configurations appear in Section 4 as luxury visual property cards featuring the unit's cover photo, property type pill, availability badge, title, bedroom/bathroom/BUA specs, and starting price.
2. **Category Filter Tabs**: If you have added both Villas and Apartments, visitors can toggle between `All Units`, `Villas`, and `Apartments`.
3. **Interactive Detail Modal**: Clicking any card opens a fullscreen presentation showing:
   - Photo gallery with interactive thumbnail switcher.
   - Architectural floor plan blueprint tab (if uploaded).
   - Full technical specifications table (Bedrooms, Bathrooms, BUA, Plot, Balconies, Furnishing, Parking).
   - Editorial layout narrative and key features tags.
   - **Dedicated WhatsApp Button**: Automatically pre-fills a personalized inquiry message identifying the exact project and unit name:
     > *"Hello Garden City Properties, I am interested in Sultan Haitham City. Property type: Villa, Configuration: 4-Bedroom Signature Beachfront Villa. Please share more details regarding availability and payment plans."*

---

## PART 7 — INVESTMENT & PAYMENT PLAN MANAGEMENT

International real estate buyers and institutional investors require total clarity on capital schedules. Section 5 allows you to configure transparent payment milestones.

### 7.1 Enabling / Disabling the Section
At the top of Section 5, toggle the **"Enable Investment & Payment Plan Section"** switch. If disabled, the entire investment section is hidden from the public project page.

### 7.2 Customizing English & Arabic Section Headings
You can customize the section branding:
- **Section Label**: Default `Investment & Payment Plan` / `الاستثمار وخطة السداد`.
- **Main Heading**: Default `Transparent Milestones & Investor Security` / `دفعات ميسرة وفرص استثمارية واعدة`.
- **Subtitle**: Default `Flexible payment milestones and high-yield ownership opportunities.` / `دفعات ميسرة وفرص تملك استثمارية ذات عوائد مجزية ومستدامة.`.

### 7.3 Adding, Editing, and Reordering Milestones
Click **"+ Add Payment Milestone"** to open the milestone modal:
1. **Step Number**: Enter two-digit sequence (e.g., `01`, `02`, `03`, `04`).
2. **Percentage / Value**: Enter percentage or trigger (e.g., `10%`, `15%`, `20%`, `On Handover`).
3. **Milestone Title (English)**: Enter title (e.g., `Down Payment & Reservation`, `Completion of Foundation`, `Handover & Key Delivery`).
4. **Milestone Title (Arabic)**: Enter Arabic translation (e.g., `دفعة الحجز والتعاقد`, `اكتمال أعمال الأساسات`, `التسليم واستلام المفتاح`).
5. **Short Description**: Describe payment terms (e.g., `Due upon signing the official reservation agreement`).
6. **Milestone Icon**: Choose an icon (`Coins`, `CreditCard`, `Landmark`, `CalendarDays`, `CheckCircle2`, `KeyRound`, etc.).

Use the up/down arrows in the milestone list to order the payment schedule chronologically.

### 7.4 Independent Bank Mortgage Financing Card
Directly beneath the milestones list is the **Independent Bank Mortgage Card**:
1. Toggle **"Enable Bank Mortgage Financing Card"**.
2. **Status / Badge**: Enter `Bank Approved` or `Pre-Approved Rates Available` (Arabic: `معتمد بنكياً`).
3. **Card Title**: `Bank Mortgages` (Arabic: `التمويل البنكي`).
4. **Eligible Banks**: List approved Omani financial institutions:
   ```
   Bank Muscat, Bank Dhofar, National Bank of Oman, Sohar International
   ```
5. **Additional Financing Info**: Note loan tenures, interest rates, or eligibility for expatriate investors.

### 7.5 Critical Financial & Legal Accuracy Warning
> ⚠️ **Important Legal Notice**: Milestone payment percentages and bank approval claims represent formal commercial terms. Always verify that:
> - Milestone percentages sum to exactly 100%.
> - Named banks have formally extended project approval under Omani banking regulations.
> - Handover payment conditions align with the project's escrow account rules.

---

## PART 8 — AMENITIES & CURATED FACILITIES

Section 6 allows you to showcase the world-class lifestyle privileges that differentiate your developments.

### 8.1 Enabling / Disabling the Section
Toggle **"Enable Amenities Section"** to control visibility on the public website.

### 8.2 Curated 1-Click Luxury Lifestyle Amenities
Admin Pro includes 12 pre-configured luxury amenities tailored to the Sultanate of Oman. Simply tick any checkbox to activate:
- [x] **Infinity Edge Swimming Pool** *(Wellness & Leisure)*
- [x] **State-of-the-Art Fitness Center** *(Sports & Fitness)*
- [x] **Landscaped Parks & Jogging Track** *(Nature & Parks)*
- [x] **24/7 Gated Security & Concierge** *(Security & Service)*
- [x] **Covered Parking & EV Charging** *(Infrastructure)*
- [x] **Boutique Retail & Dining Promenade** *(Retail & Dining)*
- [x] **Children's Play Area & Nursery** *(Family & Kids)*
- [x] **Executive Lounge & Business Hub** *(Business & Community)*
- [x] **Luxury Spa & Wellness Suites** *(Wellness & Leisure)*
- [x] **Private Beach & Lagoon Access** *(Beachfront)*
- [x] **Smart Home Automation Systems** *(Technology)*
- [x] **Dedicated Cycling Tracks** *(Sports & Fitness)*

### 8.3 Creating Custom Project-Specific Amenities
If your development includes unique privileges (e.g., *Private Helipad*, *Padel Tennis Courts*, *Yacht Club Marina Provision*):
1. Scroll to the bottom of Section 6 and click **"+ Add Custom Amenity"**.
2. Enter the **Amenity Name (English)** and **Arabic Name**.
3. Select an Icon (`Waves`, `Dumbbell`, `Trees`, `ShieldCheck`, `Car`, `Sparkles`, `Sun`, `Building2`, etc.).
4. Enter Category and Description.
5. Click **"Save Amenity"**.

### 8.4 Public Project Page Presentation
On the public project details page, amenities are rendered in Section 5 as an elegant responsive grid of dark navy cards featuring glowing cyan icons, localized titles, and category badges.

---

## PART 9 — CINEMATIC VIDEO WALKTHROUGHS

Video walk-throughs provide overseas buyers with an immersive visual experience of your project.

### 9.1 Supported Video Providers & Formats
- **Supported**:
  - YouTube standard video links: `https://www.youtube.com/watch?v=VIDEO_ID`
  - YouTube short links: `https://youtu.be/VIDEO_ID`
  - YouTube embed links: `https://www.youtube.com/embed/VIDEO_ID`
  - Direct MP4 video files hosted on a public CDN/server: `https://.../tour.mp4`
- **NOT Supported**:
  - **Google Drive links**: Google Drive blocks direct high-speed HTTP streaming, enforces login walls, and breaks video embed players. Do not use Google Drive links for videos.

### 9.2 Step-by-Step Guide to Uploading to YouTube
1. Open [YouTube Studio](https://studio.youtube.com) and sign in with your corporate account.
2. Click **Create** (Camera Icon) → **Upload Videos**.
3. Select your high-definition project video file (1080p or 4K recommended).
4. Enter the Project Title and Description.
5. On the **Visibility** step, select one of the following:
   - **Public**: Searchable by anyone on YouTube and Google (recommended for major launches).
   - **Unlisted**: Anyone with the link can view it, but it will not appear in YouTube search results (recommended for exclusive private VIP pre-launches).
   - *(Do NOT select "Private", as private videos cannot be embedded on websites).*
6. Under **Video Details → Show More**, ensure the checkbox **"Allow embedding"** is enabled.
7. Click **Save** and copy the video link (e.g., `https://youtu.be/abc123xyz`).

### 9.3 Pasting and Verifying in Admin Pro
1. In Admin Pro, scroll to **Section 9: Videos & Digital Brochures**.
2. Locate the **"Hero Video URL"** field.
3. Paste your YouTube link into the field.
4. Save the project.
5. On the public project details page, visitors will now see the cinematic **"Watch Video Presentation"** action button, which opens the video in a responsive theater modal.

---

## PART 10 — LOCATION INTELLIGENCE & NEARBY ATTRACTIONS

Location is fundamental to real estate valuation in Oman. Section 4 lets you provide exact geographical clarity.

### 10.1 Google Maps URL Entry & Auto-Resolution of Coordinates
1. Open Google Maps in your browser and locate the development site.
2. Click **Share** → **Copy Link** (e.g., `https://maps.app.goo.gl/...` or full URL).
3. In Admin Pro Section 4, paste this link into the **"Google Maps Link"** field.
4. Click the cyan button: **"Auto-Resolve Location"**.
5. Admin Pro connects to the internal geocoding resolver to automatically extract:
   - **Latitude & Longitude coordinates**
   - **Formatted Street Address**
   - **City (Muscat)** and **Country (Oman)**

### 10.2 Manual Address and Coordinate Overrides
If the project is in a newly platted development zone without a formal street address:
- You can manually type the coordinates into the **Latitude** and **Longitude** fields (e.g., `Latitude: 23.5880`, `Longitude: 58.3829`).
- You can manually type the address (e.g., `Al Seeb Coastal Strip, Sultan Haitham City, Muscat`).

### 10.3 Adding Nearby Destinations & Travel Times
Click **"+ Add Nearby Attraction"** to add key landmarks:
- **Name**: e.g., `Muscat International Airport`, `Mall of Oman`, `Sultan Qaboos Grand Mosque`, `Al Mouj Marina`.
- **Category**: Dropdown selecting `Airport`, `Hospital`, `School`, `Shopping Mall`, `Beach`, `Landmark`, etc.
- **Distance & Travel Time**: e.g., `12 km` and `15 Mins Drive`.
- **Google Maps Link**: Optional navigation link.

### 10.4 Interactive Map & Landmark Cards on the Public Page
The public project page automatically renders an interactive Leaflet/Google Map pinpointing the exact coordinates, along with an illustrated list of nearby attractions and driving times.

---

## PART 11 — EDITING EXISTING PROJECTS (SAFE UPDATE WORKFLOW)

Follow this rigorous workflow whenever modifying an existing live project to avoid accidental data loss.

### Step 1: Locate the Project in Live Properties
1. Scroll to the top of Admin Pro under **"Live Properties in Database"**.
2. Locate the development card you wish to update.
3. Click the cyan **"Edit"** button (pencil icon).

### Step 2: Confirm Edit Mode Activation
Verify that the workbench has entered edit mode:
- The top header turns into an amber banner reading:  
  **`Editing Project: [Project Name] (Updating ID: [project-slug])`**.
- The bottom action button changes from "Publish New Development" to **"Save All Changes to Project"**.
- All current prices, narrative texts, gallery photos, configurations, and amenities are loaded into the form.

### Step 3: Making Safe Updates
- **Updating Text & Prices**: Simply modify the text in the starting price, area, description, or configuration fields.
- **Keeping Existing Images (Crucial Rule)**:
  - If you do *not* want to change the main cover image, **leave the cover image file picker empty**. The existing cover image is automatically preserved!
  - If you want to replace the cover image, click **"Replace Cover Image"** and choose the new file.
  - To delete specific gallery photos, click the small trash icon on individual gallery thumbnails.
  - To add new gallery photos, click **"Add Gallery Images"** and select new files; they will be appended to the existing gallery.

### Step 4: Saving and Synchronizing
1. Scroll to the bottom of the form.
2. Click the large button: **"Save All Changes to Project"**.
3. A progress bar displays upload stages if new images were added.
4. When finished, a green success banner confirms:  
   `Successfully updated "[Project Name]" and synchronized all media & configurations!`.
5. The dashboard remains in edit mode so you can continue refining or click **"Preview"** to verify on the live website.

---

## PART 12 — COMMON ERRORS & TROUBLESHOOTING

| Error / Issue | Root Cause | Solution (Client Action) | Developer Assistance Required? |
| :--- | :--- | :--- | :---: |
| **"MIME type image/x-icon is not supported"** | Uploading an `.ico` Windows icon file instead of a photo. | Convert your file to `.jpg`, `.png`, or `.webp` before uploading. Never upload files ending in `.ico`. | **No** (Client fixable) |
| **"Total media size exceeds 40MB limit"** | Staging too many raw multi-megabyte photos at once. | Upload photos in smaller batches of 4 to 6, or re-save photos under 3 MB each. | **No** (Client fixable) |
| **Changes not appearing on live website** | Browser cache holding onto previous page version. | Perform a hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac). | **No** (Client fixable) |
| **YouTube video shows black screen / "Embedding Disabled"** | Video visibility is set to "Private" or "Embedding Disabled" in YouTube Studio. | In YouTube Studio, change visibility to "Public" or "Unlisted", and enable "Allow Embedding". | **No** (Client fixable) |
| **Google Maps auto-resolve fails** | Link is incomplete or from an unsupported map service. | In Google Maps, click "Share" → "Copy Link" and paste the clean URL. | **No** (Client fixable) |
| **"Database insert failed: duplicate key"** | Attempting to publish a new project with a slug that already exists. | In Section 10, enter a unique custom URL slug (e.g. `sultan-haitham-phase-2`). | **No** (Client fixable) |
| **Session Expired / Blank Form on Save** | Browser session token expired during extended editing. | Refresh the page, log in again, and re-enter changes. | **No** (Client fixable) |
| **Database connection error (Red indicator)** | Supabase API rate limit reached or cloud service outage. | Wait 2 minutes and click "Refresh Database". If persistent, contact developer. | **Yes** (If persistent) |
| **Domain / SSL Security Warnings** | DNS misconfiguration or expired Netlify SSL certificate. | Contact developer to renew certificate in Netlify DNS console. | **Yes** (Developer required) |

---

## PART 13 — PROFESSIONAL REAL ESTATE BEST PRACTICES

### 13.1 High-Conversion Luxury Architectural Photography
- **Daylight & Golden Hour**: Utilize architectural renders or photography captured during morning golden hour or evening blue hour when building facades and interior lighting contrast dramatically.
- **Composition**: Prefer wide-angle, level-horizon 16:9 shots. Avoid vertical mobile phone photos for project covers.
- **Decluttering**: Ensure interior renders showcase bespoke Italian kitchens, curated furniture, and expansive marble flooring.

### 13.2 File Naming Conventions
Before uploading images, rename files with descriptive names:
- Good: `sultan-haitham-city-cover-exterior.webp`, `villa-type-a-living-room.jpg`
- Avoid: `IMG_0921.jpg`, `Screenshot 2026-11-05 at 4.12.png`, `download (1).jpeg`

### 13.3 Accurate Pricing & Currency Standards
- Always format prices consistently with the official currency code: `OMR 85,000` or `OMR 1,250,000`.
- If pricing is unreleased for a pre-launch project, use `Price on Application` or `Inquire for VIP Launch Pricing`.

### 13.4 Bilingual Excellence (English & Arabic)
Garden City Properties caters to domestic Omani buyers, GCC regional investors, and international expatriates.
- Whenever possible, enter Arabic titles and descriptions for project names, configurations, and milestones.
- Maintain formal, professional Arabic real estate terminology (e.g., use `مساحة البناء` for Built-Up Area, and `دفعة الحجز والتعاقد` for Down Payment).

### 13.5 Pre-Publishing Audit
Never publish a development without verifying:
1. Contact phone number matches official business WhatsApp (`+968 97300200`).
2. Starting price matches official master developer price sheets.
3. Handover date reflects current construction timelines.
4. All unit configurations have correct bedroom and bathroom numbers.

---

## PART 14 — CLIENT RESPONSIBILITIES VS. DEVELOPER RESPONSIBILITIES

To maintain clear operational boundaries and rapid website updates, responsibilities are divided as follows:

| Management Domain | Client Independent Responsibility | Developer Support Required |
| :--- | :---: | :---: |
| **Adding New Projects** | Full Authority | Not Required |
| **Updating Prices & Handover Dates** | Full Authority | Not Required |
| **Replacing Cover & Gallery Images** | Full Authority | Not Required |
| **Adding & Editing Unit Configurations** | Full Authority | Not Required |
| **Uploading Unit Typology Photos** | Full Authority | Not Required |
| **Customizing Payment Milestones** | Full Authority | Not Required |
| **Selecting & Editing Amenities** | Full Authority | Not Required |
| **Updating YouTube Video Links** | Full Authority | Not Required |
| **Setting Google Maps & Nearby Places** | Full Authority | Not Required |
| **Publishing / Unpublishing Listings** | Full Authority | Not Required |
| **Adding New Database Tables / Columns** | Not Available | **Required** |
| **Website Source Code Alterations** | Not Available | **Required** |
| **Netlify Hosting & Domain Management** | Not Available | **Required** |
| **Supabase Authentication Policies & RLS** | Not Available | **Required** |
| **Custom Interactive Features / New Pages** | Not Available | **Required** |
| **Resolving Deep Server / Infrastructure Errors**| Not Available | **Required** |

---

## PART 15 — FINAL 10-POINT PRE-PUBLISHING CHECKLIST

Before clicking **"Publish New Development"** or **"Save All Changes to Project"**, perform this rapid 2-minute verification:

- [ ] **1. Project Identity**: Project Name and Master Developer are spelled correctly in Title Case.
- [ ] **2. Entry Price & Area**: Starting Price (`OMR ...`) and Starting Area (`... sqm`) are accurate.
- [ ] **3. Primary Cover Image**: High-resolution 16:9 landscape photograph selected (JPG, PNG, or WebP).
- [ ] **4. Narrative Description**: Comprehensive 2-to-4 paragraph architectural narrative provided.
- [ ] **5. Unit Configurations**: At least one unit typology created with bedrooms, bathrooms, BUA, and photo.
- [ ] **6. Payment Milestones**: Milestones configured and percentages verify accurately to 100%.
- [ ] **7. Curated Amenities**: Lifestyle amenities ticked and custom amenities defined with icons.
- [ ] **8. Location Intelligence**: Google Maps link verified and nearby destination driving times entered.
- [ ] **9. Video Walkthrough**: YouTube video URL tested and verified as Public or Unlisted with embedding enabled.
- [ ] **10. Live Verification**: After saving, click "Preview" to verify the live page on [gardencityproperties.net](https://www.gardencityproperties.net/).

---

*Garden City Properties Admin Pro Dashboard User Manual — November 2026 Edition.*  
*Engineered for Garden City Properties, Muscat, Sultanate of Oman.*
