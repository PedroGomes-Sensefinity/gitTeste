import React from 'react'

export function LazyRender(props) {
    const isLoading = props.isLoading

    return isLoading ? <></> : props.children
}
