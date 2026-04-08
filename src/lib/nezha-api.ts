import { SharedClient } from "@/hooks/use-rpc2"
import { LoginUserResponse, MonitorResponse, ServerGroupResponse, ServiceResponse, SettingResponse, NezhaMonitor } from "@/types/nezha-api"
import { DateTime } from "luxon"

import { getKomariNodes, uuidToNumber } from "./utils"

//let lastestRefreshTokenAt = 0

export const fetchServerGroup = async (): Promise<ServerGroupResponse> => {
  const kmNodes: Record<string, any> = await getKomariNodes()

  if (kmNodes?.error) {
    throw new Error(kmNodes.error)
  }
  // extract groups
  let groups: string[] = []
  Object.entries(kmNodes).forEach(([_, value]) => {
    if (value.group && !groups.includes(value.group)) {
      groups.push(value.group)
    }
  })

  const data: ServerGroupResponse = {
    success: true,
    data: [
      ...groups.map((group, index) => ({
        group: {
          id: index,
          created_at: DateTime.now().toISO() || "",
          updated_at: DateTime.now().toISO() || "",
          name: group,
        },
        servers: Object.entries(kmNodes)
          .filter(([_, value]) => value.group === group)
          .map(([key, _]) => uuidToNumber(key)),
      })),
    ],
  }
  return data
}

export const fetchLoginUser = async (): Promise<LoginUserResponse> => {
  const km_me = await SharedClient().call("common:getMe")
  if (km_me.error) {
    throw new Error(km_me.error)
  }
  const data: LoginUserResponse = {
    success: true,
    data: {
      id: uuidToNumber(km_me.uuid),
      username: km_me.username,
      password: "********",
      created_at: DateTime.now().toISO() || "",
      updated_at: DateTime.now().toISO() || "",
    },
  }
  return data
}
// TODO
export const fetchMonitor = async (server_id: number): Promise<MonitorResponse> => {
  // 获取 uuid 和服务器名称
  const km_nodes: Record<string, any> = await getKomariNodes()
  if (km_nodes?.error) {
    throw new Error(km_nodes.error)
  }
  const uuid = Object.keys(km_nodes).find((id) => uuidToNumber(id) === server_id)
  if (!uuid) {
    return { success: true, data: [] }
  }
  const serverName = km_nodes[uuid]?.name || String(server_id)

  const km_monitors: any = await SharedClient().call("common:getRecords", {
    type: "ping",
    uuid: uuid,
    maxCount: 2000,
    hours: 24,
  })

  // 将 km_monitors 转换为 NezhaMonitor[]
  const seriesByTask = new Map<number, NezhaMonitor>()

  if (km_monitors && Array.isArray(km_monitors.tasks) && Array.isArray(km_monitors.records)) {
    for (const task of km_monitors.tasks) {
      seriesByTask.set(task.id, {
        monitor_id: task.id,
        monitor_name: task.name,
        server_id,
        server_name: serverName,
        created_at: [],
        avg_delay: [],
        packet_loss: [],
      })
    }

    for (const rec of km_monitors.records) {
      const s = seriesByTask.get(rec.task_id)
      if (!s) continue
      const ts = Date.parse(rec.time)
      if (!Number.isFinite(ts)) continue
      const val = Number(rec.value)
      if (!Number.isFinite(val)) continue
      // val === -1 means probe failed (packet lost), record it with delay 0 and 100% loss
      s.created_at.push(ts)
      if (val === -1) {
        s.avg_delay.push(0)
        s.packet_loss!.push(100)
      } else {
        s.avg_delay.push(val)
        s.packet_loss!.push(0)
      }
    }
  } else if (Array.isArray(km_monitors)) {
    // 可能是纯 records 数组 [{ task_id, time, value, name? }]
    for (const rec of km_monitors) {
      const id: number = typeof rec.task_id === "number" ? rec.task_id : 0
      const name: string = rec.name || `task_${id}`
      if (!seriesByTask.has(id)) {
        seriesByTask.set(id, {
          monitor_id: id,
          monitor_name: name,
          server_id,
          server_name: serverName,
          created_at: [],
          avg_delay: [],
          packet_loss: [],
        })
      }
      const s = seriesByTask.get(id)!
      const ts = Date.parse(rec.time)
      if (!Number.isFinite(ts)) continue
      const val = Number(rec.value)
      if (!Number.isFinite(val)) continue
      s.created_at.push(ts)
      if (val === -1) {
        s.avg_delay.push(0)
        s.packet_loss!.push(100)
      } else {
        s.avg_delay.push(val)
        s.packet_loss!.push(0)
      }
    }
  } else {
    // 未知结构，返回空
  }

  // 每个序列按时间升序
  const data = Array.from(seriesByTask.values()).map((s) => {
    const zip = s.created_at.map((t, i) => ({ t, v: s.avg_delay[i], l: s.packet_loss?.[i] ?? 0 }))
    zip.sort((a, b) => a.t - b.t)
    return { ...s, created_at: zip.map((z) => z.t), avg_delay: zip.map((z) => z.v), packet_loss: zip.map((z) => z.l) }
  })

  // 避免空的 avg_delay
  for (const s of data) {
    if (s.avg_delay.length == 0) {
      s.packet_loss = [0]
      s.avg_delay = [0]
      s.created_at = [Date.now()]
    }
  }

  return { success: true, data }
}
// TODO
export const fetchService = async (): Promise<ServiceResponse> => {
  const response = await SharedClient().call("NoSuchMethod")
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data
}

export const fetchSetting = async (): Promise<SettingResponse> => {
  const km_public = await SharedClient().call("common:getPublicInfo")
  if (km_public.error) {
    throw new Error(km_public.error)
  }
  const km_version = await SharedClient().call("common:getVersion")
  const km_data: SettingResponse = {
    success: true,
    data: {
      config: {
        debug: false,
        language: "zh-CN",
        site_name: km_public.sitename,
        user_template: "",
        admin_template: "",
        custom_code: "", // km_public.custom_head 当作为主题时，Komari会自动在Head中插入该代码，留空即可
      },
      version: km_version.version || "unknown",
    },
  }
  return km_data
}
