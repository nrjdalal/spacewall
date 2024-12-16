import XContent from "@/components/common/x-content"
import XHeader from "@/components/common/x-header"
import Stats from "@/components/dashboard/stats"

export default async function Page() {
  return (
    <>
      <XHeader title="Dashboard" description="Welcome back, John Doe!" />
      <XContent>
        <Stats />
      </XContent>
    </>
  )
}
