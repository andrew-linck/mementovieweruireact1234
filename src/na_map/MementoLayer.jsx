import React, { Component } from 'react';
import { MementoServerContext } from './MementoServer';

export class MementoLayer extends Component {
    static contextType = MementoServerContext;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.context.addMementoServerLayer(this.props.name);
    }

    componentWillUnmount() {
        this.context.removeMementoServerLayer(this.props.name);
    }

    render() {
        return <>{this.props.children}</>;
    }
}
