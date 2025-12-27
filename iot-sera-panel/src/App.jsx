import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Thermometer, 
  Droplet, 
  Power, 
  Settings, 
  History, 
  ChevronRight,
  CircleDot,
  ZapOff,
  CloudDrizzle,
  Sun,
  Clock,
  Building 
} from 'lucide-react';

// --- Başlangıç Veri Simülasyonu ---
const createTimestamp = (date = new Date()) => date.toLocaleString('tr-TR');

const initialDevices = {
  'sera-a-1': {
    id: 'sera-a-1',
    name: 'Sera A - Bitki 1',
    status: 'online',
    sensors: { temperature: 22.5, humidity: 45 },
    controls: { lightIntensity: 70 },
    automation: {
      enabled: true,
      minHumidity: 40,
      baseWaterAmount: 100,
      lightStartTime: '08:00',
      lightEndTime: '22:00',
    },
    history: {
      sensorLog: [{ timestamp: createTimestamp(new Date(Date.now() - 3600000)), temperature: 22.1, humidity: 48 }],
      wateringLog: [{ timestamp: createTimestamp(new Date(Date.now() - 10800000)), action: 'Manuel Sulama', amount: '150mL' }],
    },
  },
  'sera-a-2': {
    id: 'sera-a-2',
    name: 'Sera A - Bitki 2',
    status: 'online',
    sensors: { temperature: 23.0, humidity: 50 },
    controls: { lightIntensity: 70 },
    automation: { enabled: true, minHumidity: 45, baseWaterAmount: 100, lightStartTime: '08:00', lightEndTime: '22:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-a-3': {
    id: 'sera-a-3',
    name: 'Sera A - Bitki 3 (Çevrimdışı)',
    status: 'offline',
    sensors: { temperature: 0, humidity: 0 },
    controls: { lightIntensity: 0 },
    automation: { enabled: false, minHumidity: 40, baseWaterAmount: 100, lightStartTime: '08:00', lightEndTime: '22:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-b-1': {
    id: 'sera-b-1',
    name: 'Sera B - Bitki 1',
    status: 'online',
    sensors: { temperature: 26.1, humidity: 55 },
    controls: { lightIntensity: 85 },
    automation: { enabled: true, minHumidity: 50, baseWaterAmount: 120, lightStartTime: '07:30', lightEndTime: '21:30' },
    history: {
      sensorLog: [{ timestamp: createTimestamp(new Date(Date.now() - 4000000)), temperature: 23.8, humidity: 58 }],
      wateringLog: [{ timestamp: createTimestamp(new Date(Date.now() - 12000000)), action: 'Otomatik Sulama', amount: '120mL' }],
    },
  },
  'sera-b-2': {
    id: 'sera-b-2',
    name: 'Sera B - Bitki 2',
    status: 'online',
    sensors: { temperature: 25.8, humidity: 52 },
    controls: { lightIntensity: 85 },
    automation: { enabled: true, minHumidity: 50, baseWaterAmount: 120, lightStartTime: '07:30', lightEndTime: '21:30' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-b-3': {
    id: 'sera-b-3',
    name: 'Sera B - Bitki 3',
    status: 'online',
    sensors: { temperature: 26.3, humidity: 54 },
    controls: { lightIntensity: 85 },
    automation: { enabled: true, minHumidity: 50, baseWaterAmount: 120, lightStartTime: '07:30', lightEndTime: '21:30' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-b-4': {
    id: 'sera-b-4',
    name: 'Sera B - Bitki 4',
    status: 'online',
    sensors: { temperature: 26.0, humidity: 53 },
    controls: { lightIntensity: 85 },
    automation: { enabled: true, minHumidity: 50, baseWaterAmount: 120, lightStartTime: '07:30', lightEndTime: '21:30' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-c-1': {
    id: 'sera-c-1',
    name: 'Sera C - Bitki 1',
    status: 'online',
    sensors: { temperature: 24.5, humidity: 60 },
    controls: { lightIntensity: 80 },
    automation: { enabled: true, minHumidity: 55, baseWaterAmount: 110, lightStartTime: '08:00', lightEndTime: '21:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-c-2': {
    id: 'sera-c-2',
    name: 'Sera C - Bitki 2',
    status: 'online',
    sensors: { temperature: 24.7, humidity: 62 },
    controls: { lightIntensity: 80 },
    automation: { enabled: true, minHumidity: 55, baseWaterAmount: 110, lightStartTime: '08:00', lightEndTime: '21:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-c-3': {
    id: 'sera-c-3',
    name: 'Sera C - Bitki 3',
    status: 'online',
    sensors: { temperature: 24.6, humidity: 61 },
    controls: { lightIntensity: 80 },
    automation: { enabled: true, minHumidity: 55, baseWaterAmount: 110, lightStartTime: '08:00', lightEndTime: '21:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
};

export default function App() {
  const [allDevices, setAllDevices] = useState(initialDevices);
  const [selectedSera, setSelectedSera] = useState('Sera A');
  const [selectedDeviceId, setSelectedDeviceId] = useState('sera-a-1');
  
  const seraNames = [...new Set(Object.values(allDevices).map(d => d.name.split(' - ')[0]))].sort();
  const devicesInSelectedSera = Object.values(allDevices).filter(d => d.name.startsWith(selectedSera));
  const selectedDevice = allDevices[selectedDeviceId];

  useEffect(() => {
    const interval = setInterval(() => {
      setAllDevices(currentDevices => {
        const newDevices = { ...currentDevices };
        Object.keys(newDevices).forEach(id => {
          const device = { ...newDevices[id] };
          if (device.status === 'offline') return;

          const newTemp = parseFloat((device.sensors.temperature + (Math.random() - 0.5) * 0.2).toFixed(1));
          const newHumid = parseFloat((device.sensors.humidity + (Math.random() - 0.5) * 0.5).toFixed(0));
          device.sensors = { temperature: newTemp, humidity: newHumid };

          const newSensorLogEntry = { timestamp: createTimestamp(), temperature: newTemp, humidity: newHumid };
          device.history = { ...device.history }; 
          device.history.sensorLog = [newSensorLogEntry, ...device.history.sensorLog.slice(0, 19)];

          if (device.automation.enabled && device.sensors.humidity < device.automation.minHumidity) {
            const baseAmount = device.automation.baseWaterAmount || 100;
            const tempBonus = device.sensors.temperature > 25 ? Math.floor(device.sensors.temperature - 25) * 10 : 0;
            const finalAmount = baseAmount + tempBonus;

            const newWaterLogEntry = { 
              timestamp: createTimestamp(), 
              action: 'Otomatik Sulama', 
              amount: `${finalAmount}mL`
            };
            device.history.wateringLog = [newWaterLogEntry, ...device.history.wateringLog.slice(0, 19)];
            device.sensors.humidity = device.sensors.humidity + 15;
          }
          newDevices[id] = device;
        });
        return newDevices;
      });
    }, 5000); 
    return () => clearInterval(interval); 
  }, []);

  const handleManualWater = (deviceId) => {
    setAllDevices(prevDevices => {
      const newDevices = { ...prevDevices };
      const device = { ...newDevices[deviceId] };
      const newWaterLogEntry = { timestamp: createTimestamp(), action: 'Manuel Sulama', amount: '150mL' };
      device.history = { ...device.history, wateringLog: [newWaterLogEntry, ...device.history.wateringLog.slice(0, 19)] };
      device.sensors = { ...device.sensors, humidity: device.sensors.humidity + 20 };
      newDevices[deviceId] = device;
      return newDevices;
    });
  };

  const handleLightIntensityChange = (deviceId, intensity) => {
    setAllDevices(prevDevices => {
      const newDevices = { ...prevDevices };
      const device = { ...newDevices[deviceId] };
      device.controls = { ...device.controls, lightIntensity: parseInt(intensity, 10) };
      newDevices[deviceId] = device;
      return newDevices;
    });
  };
  
  const handleAutomationUpdate = (deviceId, newAutomationSettings) => {
     setAllDevices(prevDevices => {
      const newDevices = { ...prevDevices };
      const device = { ...newDevices[deviceId] };
      device.automation = newAutomationSettings;
      newDevices[deviceId] = device;
      return newDevices;
    });
  };

  const handleSeraSelect = (seraName) => {
    setSelectedSera(seraName);
    const firstDeviceOfSera = Object.values(allDevices).find(d => d.name.startsWith(seraName));
    if (firstDeviceOfSera) setSelectedDeviceId(firstDeviceOfSera.id);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SeraNavigator
        seraNames={seraNames}
        selectedSera={selectedSera}
        onSelectSera={handleSeraSelect}
      />
      
      <DeviceSelector
        devices={devicesInSelectedSera}
        selectedDeviceId={selectedDeviceId}
        onSelectDevice={setSelectedDeviceId}
      />
      
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto">
        {selectedDevice ? (
          <Dashboard
            key={selectedDevice.id} 
            device={selectedDevice}
            onManualWater={() => handleManualWater(selectedDevice.id)}
            onLightIntensityChange={(intensity) => handleLightIntensityChange(selectedDevice.id, intensity)}
            onAutomationUpdate={(settings) => handleAutomationUpdate(selectedDevice.id, settings)}
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <h2 className="text-xl md:text-2xl text-gray-500 text-center px-4">Lütfen yönetmek için bir sera ve bitki seçin.</h2>
          </div>
        )}
      </main>
    </div>
  );
}

function SeraNavigator({ seraNames, selectedSera, onSelectSera }) {
  return (
    <nav className="w-full lg:w-56 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6 p-2">
        <Leaf className="text-green-500" size={28} />
        <h1 className="text-xl font-bold">IoT Sera Sistemi</h1>
      </div>
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Seralar</h2>
      <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        {seraNames.map(name => (
          <li key={name} className="flex-shrink-0 lg:flex-shrink">
            <button
              onClick={() => onSelectSera(name)}
              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all whitespace-nowrap w-full
                ${selectedSera === name
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              <Building size={20} />
              <span className="font-medium">{name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function DeviceSelector({ devices, selectedDeviceId, onSelectDevice }) {
  return (
    <nav className="w-full lg:w-64 bg-gray-50 dark:bg-gray-800/50 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[300px] lg:max-h-screen">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
        Bitkiler / Cihazlar
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
        {devices.map(device => (
          <li key={device.id}>
            <button
              onClick={() => onSelectDevice(device.id)}
              className={`w-full flex items-center justify-between gap-2 p-3 rounded-lg text-left transition-all
                ${selectedDeviceId === device.id
                  ? 'bg-white dark:bg-gray-700 shadow-sm border border-blue-500/50'
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50 border border-transparent'
                }`}
            >
              <span className="font-medium truncate text-sm sm:text-base">{device.name.split(' - ')[1]}</span>
              <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Dashboard({ device, onManualWater, onLightIntensityChange, onAutomationUpdate }) {
  const isOffline = device.status === 'offline';
  
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">{device.name}</h2>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm w-fit">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOffline ? 'bg-red-400' : 'bg-green-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
          </span>
          <span className="font-medium text-sm md:text-base">{isOffline ? 'Çevrimdışı' : 'Çevrimiçi'}</span>
        </div>
      </div>
      
      {isOffline && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-100 flex items-center gap-3">
          <ZapOff />
          <span className="text-sm md:text-base">Bu cihaz çevrimdışı. Veriler güncellenmiyor ve kontrol edilemiyor.</span>
        </div>
      )}

      {/* "Quicker" two columns: md (2), xl (3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <StatusPanel sensors={device.sensors} disabled={isOffline} />
        
        <ControlPanel
          controls={device.controls}
          onManualWater={onManualWater}
          onLightIntensityChange={onLightIntensityChange}
          disabled={isOffline}
        />
        
        <AutomationPanel
          automation={device.automation}
          onUpdate={onAutomationUpdate}
          disabled={isOffline}
        />
        
        <div className="md:col-span-2 xl:col-span-3">
          <HistoryPanel
            sensorLog={device.history.sensorLog}
            wateringLog={device.history.wateringLog}
            disabled={isOffline}
          />
        </div>
      </div>
    </div>
  );
}

function StatusPanel({ sensors, disabled }) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${disabled ? 'opacity-50' : ''}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CircleDot className="text-blue-500" size={20} /> Anlık Sensör Verileri
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
          <Thermometer className="text-blue-500" size={28} />
          <span className="text-2xl font-bold mt-2">{sensors.temperature}°C</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Sıcaklık</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-100 dark:border-green-800">
          <Droplet className="text-green-500" size={28} />
          <span className="text-2xl font-bold mt-2">{sensors.humidity}%</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Toprak Nemi</span>
        </div>
      </div>
    </div>
  );
}

function ControlPanel({ controls, onManualWater, onLightIntensityChange, disabled }) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Power className="text-red-500" size={20} /> Manuel Kontroller
      </h3>
      <div className="space-y-6"> 
        <button
          onClick={onManualWater}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg font-semibold transition-all hover:bg-blue-700 active:scale-95 disabled:bg-gray-400 shadow-md"
        >
          <CloudDrizzle size={20} />
          Direkt Sula (150mL)
        </button>
        
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <label htmlFor="light-intensity" className="font-medium flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 uppercase text-gray-500 dark:text-gray-400 font-bold">
              <Sun size={18} className={controls.lightIntensity > 0 ? 'text-yellow-500' : 'text-gray-400'} />
              Işık Şiddeti
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{controls.lightIntensity}%</span>
          </label>
          <input
            type="range"
            id="light-intensity"
            min="0"
            max="100"
            step="5"
            value={controls.lightIntensity}
            onChange={(e) => onLightIntensityChange(e.target.value)}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
}

function AutomationPanel({ automation, onUpdate, disabled }) {
  const [settings, setSettings] = useState(automation);
  useEffect(() => setSettings(automation), [automation]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value);
    setSettings(prev => ({ ...prev, [name]: finalValue }));
  };

  const hasChanged = JSON.stringify(automation) !== JSON.stringify(settings);

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Settings className="text-gray-500" size={20} /> Otomasyon Ayarları
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <label className="font-semibold text-sm">Sistemi Etkinleştir</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="enabled"
              className="sr-only peer"
              checked={settings.enabled}
              onChange={handleChange}
              disabled={disabled}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${!settings.enabled ? 'opacity-50' : ''}`}>
          <div className="p-3 border dark:border-gray-700 rounded-lg">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. Nem (%)</label>
            <input
              type="number"
              name="minHumidity"
              value={settings.minHumidity || 0}
              onChange={handleChange}
              disabled={!settings.enabled}
              className="w-full bg-transparent text-lg font-bold focus:outline-none"
            />
          </div>
          <div className="p-3 border dark:border-gray-700 rounded-lg">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Miktar (mL)</label>
            <input
              type="number"
              name="baseWaterAmount"
              value={settings.baseWaterAmount || 0}
              onChange={handleChange}
              disabled={!settings.enabled}
              className="w-full bg-transparent text-lg font-bold focus:outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={() => onUpdate(settings)}
          disabled={!hasChanged || disabled}
          className="w-full p-3 bg-green-600 text-white rounded-lg font-bold transition-all hover:bg-green-700 disabled:bg-gray-400 shadow-md"
        >
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
}

function HistoryPanel({ sensorLog, wateringLog, disabled }) {
  const [activeTab, setActiveTab] = useState('sensors'); 
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden ${disabled ? 'opacity-50' : ''}`}>
      <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History size={20} /> Kayıt Geçmişi
        </h3>
        <div className="flex p-1 bg-gray-100 dark:bg-gray-900/50 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab('sensors')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${
              activeTab === 'sensors' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500'
            }`}
          >
            Sensörler
          </button>
          <button
            onClick={() => setActiveTab('watering')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${
              activeTab === 'watering' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500'
            }`}
          >
            Sulama
          </button>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[400px]">
        {activeTab === 'sensors' ? (
          <SensorHistoryTable log={sensorLog} />
        ) : (
          <WateringHistoryTable log={wateringLog} />
        )}
      </div>
    </div>
  );
}

function SensorHistoryTable({ log }) {
  if (log.length === 0) return <p className="p-8 text-gray-500 text-center">Henüz sensör verisi kaydedilmedi.</p>;
  return (
    <table className="w-full text-left">
      <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 uppercase font-bold sticky top-0">
        <tr>
          <th className="p-4">Zaman</th>
          <th className="p-4">Sıcaklık</th>
          <th className="p-4">Nem</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {log.map((entry, index) => (
          <tr key={index} className="text-sm hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
            <td className="p-4 font-medium">{entry.timestamp}</td>
            <td className="p-4">{entry.temperature}°C</td>
            <td className="p-4">{entry.humidity}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function WateringHistoryTable({ log }) {
  if (log.length === 0) return <p className="p-8 text-gray-500 text-center">Henüz sulama kaydı bulunamadı.</p>;
  return (
    <table className="w-full text-left">
      <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 uppercase font-bold sticky top-0">
        <tr>
          <th className="p-4">Zaman</th>
          <th className="p-4">Eylem</th>
          <th className="p-4 text-right">Miktar</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {log.map((entry, index) => (
          <tr key={index} className="text-sm hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
            <td className="p-4 font-medium">{entry.timestamp}</td>
            <td className="p-4">
               <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                 entry.action === 'Manuel Sulama' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
               }`}>
                {entry.action}
              </span>
            </td>
            <td className="p-4 text-right font-bold text-blue-600">{entry.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}