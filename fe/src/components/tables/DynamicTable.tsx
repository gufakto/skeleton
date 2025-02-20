import { DynamicTableColumn } from "@/models/role";
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
                {data.map((item: any, index) => (
                        <TableRow key={index}>
                            {columns.map((column, index) => (
                                <TableCell key={index}>
                                    {column.render ? column.render(item) : item[column.name]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
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