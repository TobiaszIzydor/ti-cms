The initial release of **TiCMS** introduces a lightweight yet powerful content management system developed using Symfony. This version includes essential features for managing pages and media, providing a modern and user-friendly interface.

### Features:

- **Image Library**: Browse, add, and organize images with the ability to edit attributes such as alt text, title, and description.
- **Image Uploading**: Seamlessly upload and manage images on the server.
- **Page Management**: Create and edit pages with SEO-friendly URLs.
- **WYSIWYG Editor**: Utilize GrapesJS for a robust editing experience, with support for loading simple templates created with HTML and CSS.
- **Customizable Editor Interface**: A tailored GrapesJS UI that can be customized to fit user needs.

### How to Get Started:

1. Clone the repository:
   ```bash
   git clone https://github.com/TobiaszIzydor/ti-cms.git
   cd ti-cms
   ```

2. Install PHP dependencies with Composer:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies with npm:
   ```bash
   npm install
   ```

4. Configure the `.env` file:
   - Copy the `.env.example` file to `.env` and update the configuration for your environment (e.g., database settings).

5. Run database migrations:
   ```bash
   php bin/console doctrine:migrations:migrate
   ```

6. Start the Symfony development server:
   ```bash
   symfony server:start
   ```

7. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Technologies Used:

- **Symfony**: PHP framework for building web applications.
- **GrapesJS**: WYSIWYG editor with customizable options.
- **Doctrine ORM**: Database management.
- **Twig**: Templating engine for rendering views.

### License:
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.