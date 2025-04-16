import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { CustomTabButton } from '@/components/CustomTabButton';


export default function TabLayout() {
  const tabItems = [
    { name: 'index', href: '/', icon: 'home', label: '메인' },
    { name: 'stock/index', href: '/stock', icon: 'cart', label: '재고 요청' },
    { name: 'logout', href: '/logout', icon: 'log-out', label: '로그아웃' }
  ];

  return (
    <Tabs>
      <TabSlot />
      <TabList className="absolute bottom-8 flex items-center justify-center border border-gray-500 w-full p-2">
        {tabItems
        .filter((item) => item.href !== null)
        .map((item) =>
          item.href ? (
            <TabTrigger
              key={item.name}
              name={item.name}
              href={item.href as "/stock" | "/trouble" | "/logout" | "/"}
              asChild
            >
              <CustomTabButton icon={item.icon}>{item.label}</CustomTabButton>
            </TabTrigger>
          ) : null
        )}
      </TabList>
    </Tabs>
  );
}