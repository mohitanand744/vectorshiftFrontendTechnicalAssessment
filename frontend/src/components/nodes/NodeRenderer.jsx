import React from 'react';
import { BaseNode } from './BaseNode';
import { NODE_CONFIGS } from './configs/nodeRegistry';

export const NodeRenderer = ({ id, type, data }) => {
    const config = NODE_CONFIGS[type];
    
    if (!config) {
        console.warn(`No configuration found for node type: ${type}`);
        return null;
    }

    return <BaseNode id={id} config={config} data={data} />;
};
