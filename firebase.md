{
  "functions": {
      "codebase": "default",
      "ignore": [
          "node_modules",
          ".git",
          "firebase-debug.log",
          "firebase-debug.*.log"
      ],
      "source": "functions"
  },
  "hosting": [
      {
          "headers": [
              {
                  "headers": [
                      {
                          "key": "Content-Type",
                          "value": "application/json"
                      }
                  ],
                  "source": "/.well-known/apple-app-site-association"
              }
          ]
      },
      {
          "ignore": [
              "firebase.json",
              "**/.*",
              "**/node_modules/**"
          ],
          "public": "website",
          "rewrites": [
              {
                  "destination": "/aboutus.html",
                  "function": "expressupload",
                  "source": "/about",
                  "type": 301
              }
          ],
          "site": "maximal-security-services"
      },
      {
          "ignore": [
              "firebase.json",
              "**/.*",
              "**/node_modules/**"
          ],
          "public": "clients/build",
          "rewrites": [
              {
                  "destination": "/index.html",
                  "source": "**"
              }
          ],
          "site": "app-maximal-security-services"
      },
      {
          "ignore": [
              "firebase.json",
              "**/.*",
              "**/node_modules/**"
          ],
          "public": "admin/build",
          "rewrites": [
              {
                  "destination": "/index.html",
                  "source": "**"
              }
          ],
          "site": "admin-maximal-security-services"
      }
  ]
}