require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    "gatsby-plugin-typescript",
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: 'VIRTUALLOLLIES',
        fieldName: 'virtuallolly',
        url: 'https://fqcptkhsbjfixol3mnnsncuj5e.appsync-api.us-east-1.amazonaws.com/graphql',
        headers: {
          "x-api-key": `${process.env.GATSBY_GRAPHQL_API_ENDPOINT}`
        }
      }
    }
  ],
}
