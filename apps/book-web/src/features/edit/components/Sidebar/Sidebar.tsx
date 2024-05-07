'use client'

import { Sidebar as NextraSidebar } from '@packages/nextra-editor'
import { sidebarProps } from './props.js'

function Sidebar() {
  return <NextraSidebar {...sidebarProps} />
}

export default Sidebar
