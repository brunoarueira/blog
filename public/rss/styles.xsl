<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
  <html>
    <head>
      <title><xsl:value-of select="/rss/channel/title"/></title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        :root {
          --bg-light: #ffffff;
          --text-light: #11182b; /* gray-900 */
          --link-light: #11182b;
          --link-hover-light: #FFD700; /* gold-900 */
          --border-light: #e5e7eb; /* gray-200 */

          --bg-dark: #000000;
          --text-dark: #f3f4f6; /* gray-100 */
          --link-dark: #f3f4f6;
          --link-hover-dark: #ffe766; /* gold-500 */
          --border-dark: #374151; /* gray-700 */
        }

        body {
          font-family: 'Source Sans Pro', sans-serif;
          margin: 0 auto;
          padding: 2rem;
          max-width: 800px;
          background-color: var(--bg-light);
          color: var(--text-light);
          line-height: 1.6;
        }

        h1 {
          font-size: 2.5rem; /* Approx 4xl */
          margin-bottom: 0.5rem;
          color: var(--text-light);
        }

        h2 {
            font-size: 1.5rem; /* Approx 2xl */
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--text-light);
            border-bottom: 1px solid var(--border-light);
            padding-bottom: 0.5rem;
        }

        p {
          margin-bottom: 1rem;
        }

        a {
          color: var(--link-light);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
          text-decoration-color: var(--link-hover-light);
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        li:last-child {
            border-bottom: none;
        }

        li h3 {
            font-size: 1.25rem; /* Approx xl */
            margin-bottom: 0.5rem;
        }

        li h3 a {
            font-weight: bold;
        }

        .pubDate {
            font-size: 0.875rem; /* sm */
            color: #6b7280; /* gray-500 */
            margin-bottom: 0.5rem;
        }

        .description {
            font-size: 1rem; /* base */
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
          body {
            background-color: var(--bg-dark);
            color: var(--text-dark);
          }
          h1, h2 {
            color: var(--text-dark);
            border-bottom-color: var(--border-dark);
          }
          a {
            color: var(--link-dark);
          }
          a:hover {
            text-decoration-color: var(--link-hover-dark);
          }
          li {
            border-bottom-color: var(--border-dark);
          }
          .pubDate {
             color: #9ca3af; /* gray-400 */
          }
        }
      </style>
    </head>
    <body>
      <h1><xsl:value-of select="/rss/channel/title"/></h1>
      <p><xsl:value-of select="/rss/channel/description"/></p>
      <p>Site: <a href="{/rss/channel/link}"><xsl:value-of select="/rss/channel/link"/></a></p>

      <h2>Posts</h2>
      <ul>
        <xsl:for-each select="/rss/channel/item">
          <li>
            <h3><a href="{link}"><xsl:value-of select="title"/></a></h3>
            <div class="pubDate"><xsl:value-of select="pubDate"/></div>
            <div class="description"><xsl:value-of select="description"/></div>
            <p><a href="{link}">Read more...</a></p>
          </li>
        </xsl:for-each>
      </ul>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>

