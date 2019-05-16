export interface OptionsNode {
    value: string;
    label: string;
    linkedAnnotation: string | null;
    children?: OptionsNode[]
}

export interface Document {
    tree: OptionsNode[]
};

export interface NodeCommand {
    command: string;
    node: any;
    data: any;
};
