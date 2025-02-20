
import { DynamicTableColumn } from "@/models/table";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";

interface DynamicTableProps<T> {
    columns: DynamicTableColumn[];
    data: T[];
    footer: boolean;
}

export const DynamicTable = <T,>({
    columns,
    data,
    footer = true
}: DynamicTableProps<T>) => {
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }
    return (<>
        <Table className="min-w-full table-auto">
            <TableHeader className="bg-gray-100">
                <TableRow>
                    {columns.map((column, index) => (
                        <TableHead key={index}>{column.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length>0 ? data.map((item: any, index) => (
                        <TableRow key={index}>
                            {columns.map((column, index) => (
                                <TableCell key={index}>
                                    {column.render ? column.render(item) : item[column.name]}
                                </TableCell>
                            ))}
                        </TableRow>
                    )):null}
            </TableBody>
            {footer && (
                <TableFooter>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHead key={index}>{column.label}</TableHead>
                        ))}
                    </TableRow>
                </TableFooter>
            )}

        </Table>
    </>)
}