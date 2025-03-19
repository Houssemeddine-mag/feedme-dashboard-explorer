
import React, { useState } from "react";
import { InfoDialog } from "./info-dialog";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Card, CardContent } from "./card";
import { Code } from "lucide-react";

export const SpringBootInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={() => setIsOpen(true)}
      >
        <Code size={16} />
        <span>API Info</span>
      </Button>
      
      <InfoDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Spring Boot REST API"
        description="Information about connecting to the backend API"
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6 space-y-2 text-sm">
                <p>The FeedMe Dashboard has a Spring Boot backend API that provides:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Authentication and user management</li>
                  <li>Restaurant data management</li>
                  <li>Menu and dish management</li>
                  <li>Human resources management</li>
                  <li>Analytics and reporting</li>
                </ul>
                <p className="text-muted-foreground mt-2">Note: This is a conceptual API design that would need to be implemented separately.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="setup">
            <Card>
              <CardContent className="pt-6 space-y-2 text-sm">
                <p>To set up the Spring Boot API:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Clone the repository (separate from frontend)</li>
                  <li>Install Java 17+ and Maven</li>
                  <li>Run <code className="bg-muted px-1 rounded">./mvnw spring-boot:run</code></li>
                  <li>Access API at <code className="bg-muted px-1 rounded">http://localhost:8080/api</code></li>
                  <li>Swagger docs at <code className="bg-muted px-1 rounded">http://localhost:8080/swagger-ui.html</code></li>
                </ol>
                <p className="text-muted-foreground mt-2">Note: The backend should be deployed separately from the frontend.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="endpoints">
            <Card>
              <CardContent className="pt-6 space-y-2 text-sm">
                <p>Main API endpoints:</p>
                <ul className="space-y-1">
                  <li><code className="bg-muted px-1 rounded">GET /api/restaurants</code> - List all restaurants</li>
                  <li><code className="bg-muted px-1 rounded">GET /api/menu/dishes</code> - List all dishes</li>
                  <li><code className="bg-muted px-1 rounded">GET /api/menu/ingredients</code> - List ingredients</li>
                  <li><code className="bg-muted px-1 rounded">GET /api/menu/packs</code> - List meal packs</li>
                  <li><code className="bg-muted px-1 rounded">GET /api/hr/directors</code> - List directors</li>
                  <li><code className="bg-muted px-1 rounded">POST /api/auth/login</code> - Authentication</li>
                </ul>
                <p className="text-muted-foreground mt-2">All endpoints follow REST conventions with GET, POST, PUT, DELETE methods.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </InfoDialog>
    </>
  );
};
