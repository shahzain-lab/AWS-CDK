import React, { FC } from 'react';
import Lolly from '../components/Lolly';
import Layout from '../layout/Layout';

interface PageContext {
    pageContext: {
        node: {
        recName: string
        message: string
        senderName: string
        flavorTop: string
        flavorMiddle: string
        flavorBottom: string
        slug: string
    }
    }
       
}

const IceCreamPage: FC<PageContext> = ({ pageContext }) => {
    // console.log(window.location.origin);
    const { node } = pageContext;

    return (
        <Layout>
            <div title="Ice-Cream" />
            <div>
                <div style={{ width: '180px' }} >
                <Lolly fillLollyTop={node.flavorTop} fillLollyMiddle={node.flavorMiddle} fillLollyBottom={node.flavorBottom} />                </div>
                <div style={{color: 'white'}}>
                    <p>This Ice-Cream is for you.</p>
                    <div>
                        <div>Dear {node.recName},</div>
                        <div>{node.message}</div>
                        <div style={{margin:'auto 0 10px 0',textAlign:'center'}}>____{node.senderName}</div>
                    </div>
                </div>
            </div>

        </Layout>
    )
}
export default IceCreamPage;