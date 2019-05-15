export interface OptionsNode {
    value: string;
    label: string;
    children?: OptionsNode[]
}

export interface Document {
    meaningOfLife: number
};

export interface NodeCommand {
    command: string;
    node: any;
    data: any;
};
