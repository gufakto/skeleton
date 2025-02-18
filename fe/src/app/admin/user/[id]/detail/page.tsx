import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import UserDetail from '@/components/user/UserDetail';
import { authOptions } from '@/lib/auth';
import { UserModel } from '@/models/user';
import { getServerSession } from 'next-auth';

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_CONTAINER}/v1/admin/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })
  const data = await res.json();
  const user = data.data as UserModel;
  if (!user) return <div>User not found</div>
  return (<>
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="space-y-6">
        <PageBreadcrumb pageTitle={`User #${user?.name}`} />
        <UserDetail user={user} editable={false} />
      </div>
    </div>
  </>)
}
                    