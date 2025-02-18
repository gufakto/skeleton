"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

export default function BasicForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:");
  };
  return (
    <ComponentCard title="Basic Form">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Input type="text" placeholder="Name" />
          </div>
          <div>
            <Input type="text" placeholder="Email address" />
          </div>
          <div className="col-span-full">
            <Input type="text" placeholder="Password" />
          </div>
          <div className="col-span-full">
            <Input type="text" placeholder="Confirm Password" />
          </div>
          <div className="col-span-full">
            <Button className="w-full" size="sm">
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
