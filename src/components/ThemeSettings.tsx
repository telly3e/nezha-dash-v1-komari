import { cn } from "@/lib/utils"
import { Settings } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"

interface ToggleSetting {
  key: string
  labelKey: string
  windowVar: string
  storageKey: string
}

const TOGGLE_SETTINGS: ToggleSetting[] = [
  {
    key: "showTrafficBar",
    labelKey: "themeSettings.showTrafficBar",
    windowVar: "ShowTrafficBar",
    storageKey: "komari_ShowTrafficBar",
  },
  {
    key: "mergeDetailAndNetwork",
    labelKey: "themeSettings.mergeDetailAndNetwork",
    windowVar: "MergeDetailAndNetwork",
    storageKey: "komari_MergeDetailAndNetwork",
  },
  {
    key: "networkFirst",
    labelKey: "themeSettings.networkFirst",
    windowVar: "NetworkFirst",
    storageKey: "komari_NetworkFirst",
  },
  {
    key: "hidePlanInfo",
    labelKey: "themeSettings.hidePlanInfo",
    windowVar: "HidePlanInfo",
    storageKey: "komari_HidePlanInfo",
  },
]

function getSettingValue(setting: ToggleSetting): boolean {
  const stored = localStorage.getItem(setting.storageKey)
  if (stored !== null) return stored === "1"
  return !!(window as any)[setting.windowVar]
}

function applySettingToWindow(setting: ToggleSetting, value: boolean) {
  ;(window as any)[setting.windowVar] = value
}

export default function ThemeSettings() {
  const { t } = useTranslation()
  const [values, setValues] = useState<Record<string, boolean>>({})

  const customBackgroundImage = (window.CustomBackgroundImage as string) !== "" ? window.CustomBackgroundImage : undefined

  useEffect(() => {
    const initial: Record<string, boolean> = {}
    for (const setting of TOGGLE_SETTINGS) {
      const val = getSettingValue(setting)
      initial[setting.key] = val
      applySettingToWindow(setting, val)
    }
    setValues(initial)
  }, [])

  const handleToggle = useCallback((setting: ToggleSetting, checked: boolean) => {
    setValues((prev) => ({ ...prev, [setting.key]: checked }))
    localStorage.setItem(setting.storageKey, checked ? "1" : "0")
    applySettingToWindow(setting, checked)
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("rounded-full px-[9px] bg-white dark:bg-black", {
            "bg-white/70 dark:bg-black/70": customBackgroundImage,
          })}
          title={t("themeSettings.title")}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-base">{t("themeSettings.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {TOGGLE_SETTINGS.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <Label htmlFor={setting.key} className="text-sm font-medium cursor-pointer">
                {t(setting.labelKey)}
              </Label>
              <Switch
                id={setting.key}
                checked={values[setting.key] ?? false}
                onCheckedChange={(checked) => handleToggle(setting, checked)}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
