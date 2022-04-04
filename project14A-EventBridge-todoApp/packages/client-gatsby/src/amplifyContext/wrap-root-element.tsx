import React, { ReactNode } from "react"
import AmplifyClient from "./client"
import '../../src/styles/global.css';

type props = {
  element: ReactNode
}

export default ({ element }: props) => (<AmplifyClient>{element}</AmplifyClient>);