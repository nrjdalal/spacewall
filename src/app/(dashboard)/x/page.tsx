import XContent from "@/components/common/x-content"
import XHeader from "@/components/common/x-header"
import Stats from "@/components/dashboard/stats"

export default async function Page() {
  return (
    <>
      <XHeader title="Dashboard" description="Welcome to the dashboard." />
      <XContent>
        <Stats />
      </XContent>
    </>
  )
}
