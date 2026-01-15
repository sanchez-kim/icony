import { Sidebar } from './Sidebar';
import { CustomizationPanel } from '../CustomizationPanel/CustomizationPanel';

export function MainLayout() {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
        <div className="lg:col-span-2">
          <CustomizationPanel />
        </div>
      </div>
    </div>
  );
}
