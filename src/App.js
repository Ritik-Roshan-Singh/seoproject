import { apiRequest, isValidURL } from './config'
import { Button, Input, Progress, Spin, message } from 'antd'
import React, { useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function App() {
  const [url, setUrl] = useState("")
  const [summary, setSummary] = useState({})
  const [pageData, setPageData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showStats, setShowStats] = useState(false)

  async function taskPost(data) {
    return await apiRequest({
      path: 'v3/on_page/task_post',
      data: [
        {
          "target": `${data}`,
          "max_crawl_pages": 5,
          "load_resources": true,
          "enable_javascript": true,
        }
      ]
    })
  }
  async function summaryHandler(id) {
    return await apiRequest({
      path: `v3/on_page/summary/${id}`,
      method: "GET"
    })
  }
  async function pageSummary(id) {
    return await apiRequest({
      path: `v3/on_page/pages`,
      data: [
        {
          id: id,
          limit: 1
        }
      ]
    })
  }
  async function getReadyTask() {
    return await apiRequest({
      path: `v3/on_page/tasks_ready`,
      method: "GET"
    })
  }

  async function enterHandler() {
    if (url && isValidURL(url)) {
      setIsLoading(true)
      try {
        const response1 = await taskPost(url)
        const response3 = await pageSummary(response1.tasks[0].id)
        console.log(response1,response3);
        // const response5 = await summaryHandler(response1.tasks[0].id)
        const response5 = await summaryHandler("09161044-6695-0216-0000-9a762d2eb813")
      
        // const response4 = await getReadyTask()
        console.log(response5)
        if (response5.tasks[0].result_count == 0) {
          message.error("No result found")
          return
        }
        // const response5 = await summaryHandler(response4.tasks[0].result.at(-1).id)
        const { page_metrics } = response5.tasks[0].result[0]
        const { links_external, links_internal, duplicate_title, duplicate_content, broken_resources, broken_links } = page_metrics
        const pageMeticsData = [
          {
            name: "Links External",
            value: links_external
          },
          {
            name: "Links Internal",
            value: links_internal
          },
          {
            name: "Duplicate Title",
            value: duplicate_title
          },
          {
            name: "Duplicate Content",
            value: duplicate_content
          },
          {
            name: "Broken Resources",
            value: broken_resources
          },
          {
            name: "Broken Links",
            value: broken_links
          },
        ]
        setSummary({
          page_metrics,
          pageMeticsData,
          "extraData": response5.tasks[0].result[0]
        })

        setIsLoading(false)
        setShowStats(true)
      } catch (e) {
        message.error("Error while fetching data")
        setIsLoading(false)
        return
      }
    } else {
      message.warning("Please check the url entered")
    }
  }


  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'scroll', paddingBottom: 20 }}>
      {!showStats ? <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {isLoading ? <Spin size="large" /> : <div style={{ width: '50%', display: 'flex', alignItems: 'center', }}>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Basic usage" style={{ width: '80%', marginRight: 10 }} />
          <Button type='primary' onClick={enterHandler}>Enter</Button>
        </div>}

      </div>
        :
        <div style={{ margin: "20px", width: '80%', height: '100%',marginLeft:'auto',marginRight:'auto' }}>
          <Button style={{ margin: 10 }} onClick={() => setShowStats(false)}>Back</Button>
          <div style={{
            fontSize: 30,
            fontWeight: "bold",
            marginTop: 20,
            textAlign: 'center'

          }}>Site: {url}</div>
          <div style={{ marginBottom: "20px" }}>
            <h1>On Page Score</h1>
            <Progress percent={summary.page_metrics.onpage_score} />
          </div>
          <ResponsiveContainer width="80%" height="60%" >
            <BarChart
              width={200}
              height={400}
              data={summary.pageMeticsData}

            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 20 }}>
            <h2 style={{ margin: '10px 0px' }}>Other Details</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {Object.keys(summary.page_metrics.checks).map((item, index) => {
                return <div style={{
                  boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                  padding: "10px 15px",
                  minHeight: 50,
                  minWidth: 200,
                  borderRadius: 10,
                  backgroundColor:index%2==0?'#f3f0ff':"#fff9db"
                }}

                  key={index + 'i'}>
                  <div style={{ textAlign: 'center' }}>{summary.page_metrics.checks[item]}</div>
                  <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.replace(/_/g, ' ')}</div>
                </div>
              })}
            </div>

          </div>
        </div>}
    </div>
  )
}

export default App;