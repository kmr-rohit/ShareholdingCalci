import React from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
const FounderInput = ({ founder, onChange }) => (
  <div>
    <Label htmlFor={`founder-${founder.id}-share`}>Founder {founder.id} Share (%)</Label>
    <Input
      id={`founder-${founder.id}-share`}
      type="number"
      max="100"
      value={founder.share}
      onChange={(e) => onChange(founder.id, e.target.value)}
    />
  </div>
);

export default FounderInput;