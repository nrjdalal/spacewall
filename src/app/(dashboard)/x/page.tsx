import XHeader from "@/components/common/x-header"
import Stats from "@/components/dashboard/stats"
import { Content, ContentRoot } from "@/components/x/content"

export default async function Page() {
  return (
    <>
      <XHeader title="Dashboard" description="Welcome to the dashboard." />
      <ContentRoot>
        <Content className="col-span-5 max-w-screen-lg">
          <Stats />
        </Content>
      </ContentRoot>
    </>
  )
}
