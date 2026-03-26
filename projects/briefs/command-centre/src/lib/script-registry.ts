export interface ArgDefinition {
  name: string;
  label: string;
  required: boolean;
  placeholder?: string;
}

export interface ScriptDefinition {
  id: string;
  label: string;
  description: string;
  file: string;
  args: ArgDefinition[];
  destructive: boolean;
  longRunning?: boolean;
}

export const SCRIPT_REGISTRY: ScriptDefinition[] = [
  {
    id: "add-client",
    label: "Add Client",
    description: "Create a new client workspace with brand context, memory, and project folders",
    file: "add-client.sh",
    args: [{ name: "clientName", label: "Client Name", required: true, placeholder: "e.g. Acme Corp" }],
    destructive: false,
  },
  {
    id: "add-skill",
    label: "Add Skill",
    description: "Install a skill from the catalog into the skills directory",
    file: "add-skill.sh",
    args: [{ name: "skillName", label: "Skill Name", required: true, placeholder: "e.g. mkt-email-sequence" }],
    destructive: false,
  },
  {
    id: "remove-skill",
    label: "Remove Skill",
    description: "Uninstall a skill and remove its folder from the skills directory",
    file: "remove-skill.sh",
    args: [{ name: "skillName", label: "Skill Name", required: true, placeholder: "e.g. mkt-email-sequence" }],
    destructive: true,
  },
  {
    id: "list-skills",
    label: "List Skills",
    description: "Show all installed skills with their descriptions",
    file: "list-skills.sh",
    args: [],
    destructive: false,
  },
  {
    id: "update",
    label: "Update Agentic OS",
    description: "Pull the latest version and update all files",
    file: "update.sh",
    args: [],
    destructive: true,
    longRunning: true,
  },
  {
    id: "install-crons",
    label: "Install Cron Dispatcher",
    description: "Set up the LaunchAgent for scheduled job execution",
    file: "install-crons.sh",
    args: [],
    destructive: false,
  },
  {
    id: "uninstall-crons",
    label: "Uninstall Cron Dispatcher",
    description: "Remove the LaunchAgent and stop scheduled job execution",
    file: "uninstall-crons.sh",
    args: [],
    destructive: true,
  },
  {
    id: "check-updates",
    label: "Check for Updates",
    description: "Check if a newer version of Agentic OS is available",
    file: "check-updates.sh",
    args: [],
    destructive: false,
  },
  {
    id: "update-clients",
    label: "Update All Clients",
    description: "Sync shared skills and configuration to all client workspaces",
    file: "update-clients.sh",
    args: [],
    destructive: true,
  },
  {
    id: "install",
    label: "Install Agentic OS",
    description: "Run the full installation process including dependencies and configuration",
    file: "install.sh",
    args: [],
    destructive: true,
    longRunning: true,
  },
  {
    id: "setup",
    label: "Setup",
    description: "Run initial setup including environment configuration and dependency checks",
    file: "setup.sh",
    args: [],
    destructive: false,
    longRunning: true,
  },
];

export function getScriptById(id: string): ScriptDefinition | undefined {
  return SCRIPT_REGISTRY.find((s) => s.id === id);
}
