const fs = require('fs');

const path = 'd:/Edenify/frontend/src/AppContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const injection = `
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Capacitor?.isNativePlatform()) return;
    const triggeredAlarms = new Set();
    const checkActiveAlarms = () => {
      const now = new Date();
      const hours12 = now.getHours() % 12 || 12;
      const hoursStr = hours12.toString().padStart(2, '0');
      const minutesStr = now.getMinutes().toString().padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      const timeMatches = [
        \`\${hoursStr}:\${minutesStr} \${ampm}\`,
        \`\${now.getHours().toString().padStart(2, '0')}:\${minutesStr}\`
      ];

      tasks.forEach((task) => {
        if (task.completed || task.alarmEnabled === false) return;
        const isBibleTask = task.id === 'daily-bible-reading-task';
        const taskReminderEnabled = Boolean(user?.preferences?.notifications?.taskReminders);
        const bibleReminderEnabled = Boolean(user?.preferences?.notifications?.dailyScripture) && Boolean(user?.preferences?.bibleReminderAlarm ?? true);
        if (!taskReminderEnabled && !(isBibleTask && bibleReminderEnabled)) return;

        const taskTime = (task.time || '').trim().toUpperCase();
        if (timeMatches.includes(taskTime)) {
          const runKey = \`\${task.id}-\${now.toDateString()}-\${now.getHours()}:\${now.getMinutes()}\`;
          if (!triggeredAlarms.has(runKey)) {
             triggeredAlarms.add(runKey);
             const params = new URLSearchParams();
             params.set('title', 'Edenify Alarm');
             params.set('body', \`\${task.name} is due now (\${task.time}).\`);
             window.location.href = '/alarm-overlay?' + params.toString();
          }
        }
      });
    };
    const id = window.setInterval(checkActiveAlarms, 10000);
    return () => window.clearInterval(id);
  }, [tasks, user?.preferences?.notifications, user?.preferences?.bibleReminderAlarm]);
`;

content = content.replace('const id = window.setInterval(syncBibleCompletionWithCalendar, 60 * 1000);\n    return () => window.clearInterval(id);\n  }, []);', 'const id = window.setInterval(syncBibleCompletionWithCalendar, 60 * 1000);\n    return () => window.clearInterval(id);\n  }, []);\n' + injection);
content = content.replace('const id = window.setInterval(syncBibleCompletionWithCalendar, 60 * 1000);\r\n    return () => window.clearInterval(id);\r\n  }, []);', 'const id = window.setInterval(syncBibleCompletionWithCalendar, 60 * 1000);\r\n    return () => window.clearInterval(id);\r\n  }, []);\r\n' + injection);

fs.writeFileSync(path, content, 'utf8');
console.log('patched context');
