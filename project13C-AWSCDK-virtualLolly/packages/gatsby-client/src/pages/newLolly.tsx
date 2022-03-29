import React, { useState } from 'react';
import Layout from '../layout/Layout';
import Lolly from '../components/Lolly';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import shortid from 'shortid';
import { navigate } from 'gatsby';
import {API} from 'aws-amplify'
import { createLolly } from '../graphql/mutations';


const NewLolly = () => {
    const [clr1, setclr1] = useState('#fa43d2')
    const [clr2, setclr2] = useState("#fac219")
    const [clr3, setclr3] = useState("#fa73d9")
    // const [lollies, setLollies] = useState()

    const onSubmit = async (values: any, actions: any) => {
      try{
         const slug = shortid.generate();
        console.log(slug);
        const result = await API.graphql({
          query: createLolly,
            variables: {
                recName: values.to,
                message: values.message,
                senderName: values.from,
                flavorTop: clr1,
                flavorMiddle: clr2,
                flavorBottom: clr3,
                slug: slug,
            },
        });
        console.log(result);
        // setLollies(result)
        await actions.resetForm({
            values: {
                to: "",
                message: "",
                from: "",
            },
        });
        navigate(`/lollies/${slug}`)


      }catch(err){
        return <h1>Error could'nt create {err}</h1>
      }
       
    }
    return <Layout>
        <div className='lolly--page'>
            <div className='lolly--lollypicker'>
                <Lolly fillLollyTop={clr1} fillLollyMiddle={clr2} fillLollyBottom={clr3} />
                <div className='lolly--clrpicker'>
                    <label htmlFor='color for fillLollyTop' className="colorPickerLabel">
                        <input type='color' value={clr1} onChange={e => setclr1(e.target.value)} name="flavourTop" className="colorPicker" id="flavourTop" />
                    </label>
                    <label htmlFor='color for fillLollyMiddle' className="colorPickerLabel">
                        <input type='color' value={clr2} onChange={e => setclr2(e.target.value)} className="colorPicker" name="flavourTop" id="flavourTop" />
                    </label>
                    <label htmlFor='color for fillLollyBottom' className="colorPickerLabel">
                        <input type='color' value={clr3} onChange={e => setclr3(e.target.value)} className="colorPicker" name="flavourTop" id="flavourTop" /></label>
                </div>
            </div>
            <div>
                <Formik
                    initialValues={{ to: '', message: '', from: '' }}
                    validationSchema={Yup.object({
                        to: Yup.string()
                            .min(3, 'Must be 3 characters or bigger')
                            .required('Sender Name is Required'),
                        message: Yup.string()
                            .min(10, 'Must be 10 characters or bigger')
                            .required('Required'),
                        from: Yup.string().required('Name is Required'),
                    })}
                    onSubmit={onSubmit}
                >
                    <Form
                        className='lolly--form'>
                        <label htmlFor="to" className="nameLabled">To</label>
                        <Field name="to" className="nameFields" type="text" />
                        <ErrorMessage name="to" />
                        <label htmlFor="message" className="nameLabled">Message</label>
                        <Field name="message" className="nameFields" as="textarea" rows="15" columns="30" />
                        <ErrorMessage name="message" />

                        <label htmlFor="from" className="nameLabled">From</label>
                        <Field name="from" className="nameFields" type="text" />
                        <ErrorMessage name="from" />

                        <button type="submit" className="btn--lolly">Submit</button>
                    </Form>
                </Formik>
            </div>
        </div>
    </Layout >;
};

export default NewLolly;