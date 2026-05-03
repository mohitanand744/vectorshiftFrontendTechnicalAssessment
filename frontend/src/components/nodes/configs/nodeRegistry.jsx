import { 
    ArrowRightEndOnRectangleIcon, 
    ArrowLeftStartOnRectangleIcon, 
    DocumentTextIcon, 
    CpuChipIcon, 
    CommandLineIcon, 
    FunnelIcon, 
    CalculatorIcon, 
    ClockIcon, 
    ArrowsRightLeftIcon 
} from '@heroicons/react/24/outline';

export const NODE_CONFIGS = {
    input: {
        type: 'input',
        title: 'Input',
        icon: ArrowRightEndOnRectangleIcon,
        themeColor: 'emerald',
        inputs: [],
        outputs: [{ id: 'value' }],
        fields: [
            {
                key: 'name',
                label: 'Field Name',
                type: 'text',
                default: 'input_1'
            },
            {
                key: 'type',
                label: 'Data Type',
                type: 'select',
                options: [
                    { label: 'Text', value: 'text' },
                    { label: 'File', value: 'file' }
                ],
                default: 'text'
            }
        ]
    },
    output: {
        type: 'output',
        title: 'Output',
        icon: ArrowLeftStartOnRectangleIcon,
        themeColor: 'rose',
        inputs: [{ id: 'value' }],
        outputs: [],
        fields: [
            {
                key: 'name',
                label: 'Field Name',
                type: 'text',
                default: 'output_1'
            },
            {
                key: 'type',
                label: 'Data Type',
                type: 'select',
                options: [
                    { label: 'Text', value: 'text' },
                    { label: 'Image', value: 'image' }
                ],
                default: 'text'
            }
        ]
    },
    llm: {
        type: 'llm',
        title: 'LLM',
        icon: CpuChipIcon,
        themeColor: 'primary',
        inputs: [
            { id: 'system', label: 'System', style: { top: '33%' } },
            { id: 'prompt', label: 'Prompt', style: { top: '66%' } }
        ],
        outputs: [{ id: 'response' }],
        fields: [
            {
                key: 'model',
                label: 'Model',
                type: 'modelSelect',
                default: 'gpt-4'
            }
        ]
    },
    text: {
        type: 'text',
        title: 'Text Content',
        icon: DocumentTextIcon,
        themeColor: 'primary',
        inputs: [],
        outputs: [{ id: 'output' }],
        fields: [
            {
                key: 'text',
                label: 'Message Editor',
                type: 'textarea',
                default: '',
                placeholder: 'Type {{variable}} to create handles...',
                isDynamic: true
            }
        ]
    },
    api: {
        type: 'api',
        title: 'API Request',
        icon: CommandLineIcon,
        themeColor: 'indigo',
        inputs: [{ id: 'input' }],
        outputs: [{ id: 'output' }, { id: 'error', style: { top: '80%' } }],
        fields: [
            {
                key: 'url',
                label: 'Endpoint URL',
                type: 'text',
                default: 'https://api.example.com'
            },
            {
                key: 'method',
                label: 'Method',
                type: 'select',
                options: [
                    { label: 'GET', value: 'GET' },
                    { label: 'POST', value: 'POST' },
                    { label: 'PUT', value: 'PUT' }
                ],
                default: 'GET'
            }
        ]
    },
    filter: {
        type: 'filter',
        title: 'Filter',
        icon: FunnelIcon,
        themeColor: 'amber',
        inputs: [{ id: 'input' }],
        outputs: [{ id: 'output' }],
        fields: [
            {
                key: 'condition',
                label: 'Condition',
                type: 'text',
                default: 'x > 0'
            }
        ]
    },
    math: {
        type: 'math',
        title: 'Math',
        icon: CalculatorIcon,
        themeColor: 'fuchsia',
        inputs: [{ id: 'a' }, { id: 'b' }],
        outputs: [{ id: 'result' }],
        fields: [
            {
                key: 'operation',
                label: 'Operation',
                type: 'select',
                options: [
                    { label: 'Add', value: '+' },
                    { label: 'Subtract', value: '-' },
                    { label: 'Multiply', value: '*' }
                ],
                default: '+'
            }
        ]
    },
    condition: {
        type: 'condition',
        title: 'Condition',
        icon: ArrowsRightLeftIcon,
        themeColor: 'cyan',
        inputs: [{ id: 'input' }],
        outputs: [
            { id: 'true', label: 'True', style: { top: '40%' } },
            { id: 'false', label: 'False', style: { top: '70%' } }
        ],
        fields: [
            {
                key: 'expression',
                label: 'Expression',
                type: 'text',
                default: 'value === true'
            }
        ]
    },
    delay: {
        type: 'delay',
        title: 'Delay',
        icon: ClockIcon,
        themeColor: 'orange',
        inputs: [{ id: 'input' }],
        outputs: [{ id: 'output' }],
        fields: [
            {
                key: 'duration',
                label: 'Wait (ms)',
                type: 'number',
                default: 1000
            }
        ]
    }
};
