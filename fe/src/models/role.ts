
export interface DynamicTableColumn {
    render?: (data: any) => React.ReactNode;
    name: string
    label: string | React.ReactNode;
    class?: string
}

