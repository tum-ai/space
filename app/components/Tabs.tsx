import * as RadixTabs from "@radix-ui/react-tabs";

export default function Tabs({ tabs, ...props }) {
  return (
    <RadixTabs.Root {...props}>
      <RadixTabs.List className="mb-8 grid grid-cols-2 text-xl">
        {Object.keys(tabs).map((tabName) => (
          <RadixTabs.Trigger
            key={tabName}
            value={tabName}
            className="p-4 text-gray-400 data-[state=active]:border-t-[1px] data-[state=active]:border-gray-700 data-[state=active]:text-black dark:data-[state=active]:border-white dark:data-[state=active]:text-white"
          >
            {tabName}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {Object.keys(tabs).map((tabName) => (
        <RadixTabs.Content key={`${tabName}-content`} value={tabName}>
          {tabs[tabName]}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
