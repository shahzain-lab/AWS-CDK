exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const {data} = await graphql(
    `{ 
    virtuallolly {
         allLollies {
            recName
            message
            senderName
            flavorTop
            flavorMiddle
            flavorBottom
            slug
          }
       }
    }
    `
    );
    // console.log(JSON.stringify(result));
    data?.virtuallolly?.allLollies.forEach((node) => {
        createPage({
            path: `/ice-cream/${node.slug}`,
            component: require.resolve("./src/templates/IceCreamPage.tsx"),
            context: {
               node
            }
        })
    })
}