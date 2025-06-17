"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function ReadSwitch() {
  const [isRead, setIsRead] = useState(false);

  return (
    <div className="flex items-center h-10 px-4 border rounded-md border-input bg-background text-sm gap-2 hover:bg-accent hover:text-primary">
      <Switch
        id="read-switch"
        checked={isRead}
        onCheckedChange={(val) => {
          setIsRead(val);
          console.log("Read state:", val);
        }}
      />
      <Label htmlFor="read-switch" className="cursor-pointer">
        {isRead ? "Mark as Unread" : "Mark as Read"}
      </Label>
    </div>
  );
}

export default ReadSwitch;
