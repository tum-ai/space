import * as RadixTabs from "@radix-ui/react-tabs";

export default function Tabs({ tabs, ...props }) {
  return (
    <RadixTabs.Root {...props}>
      <RadixTabs.List className="grid grid-cols-2 text-xl mb-4">
        {Object.keys(tabs).map((tabName) => (
          <RadixTabs.Trigger
            key={tabName}
            value={tabName}
            className="border-b-[1px] border-gray-400 p-4 text-gray-400 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white"
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
