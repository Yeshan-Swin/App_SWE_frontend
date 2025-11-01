import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DevOpsDashboard() {
  return (
    <div className="devops-dashboard">
      <div className="devops-header">
        <div>
          <h1>DevOps Pipeline</h1>
          <p className="text-gray-500">Setup guide for your pipeline</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup Guide</CardTitle>
          <CardDescription>Get your DevOps pipeline up and running</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="setup-steps">
            <div className="setup-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Connect to GitHub</h3>
                <p>Push your TimeAlign code to a GitHub repository</p>
                <code className="code-block">
                  git init{"\n"}
                  git remote add origin https://github.com/YOUR_USERNAME/timealign.git{"\n"}
                  git add .{"\n"}
                  git commit -m "Initial commit"{"\n"}
                  git push -u origin main
                </code>
              </div>
            </div>

            <div className="setup-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Configure GitHub Secrets</h3>
                <p>Add these repository secrets (Settings → Secrets → Actions):</p>
                <ul className="setup-list">
                  <li><code>DEPLOYMENT_TOKEN</code> — JWT token for API authentication</li>
                  <li><code>MONGO_URL</code> — MongoDB connection string</li>
                  <li><code>DB_NAME</code> — Database name</li>
                </ul>
              </div>
            </div>

            <div className="setup-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Set up Environments</h3>
                <p>Create GitHub environments for deployment protection:</p>
                <ul className="setup-list">
                  <li><strong>preview</strong> — Auto-deploy from <code>develop</code></li>
                  <li><strong>production</strong> — Manual approval required</li>
                </ul>
              </div>
            </div>

            <div className="setup-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Trigger Your First Deploy</h3>
                <p>Push to develop or main to trigger the pipeline:</p>
                <code className="code-block">
                  git checkout -b develop{"\n"}
                  git push origin develop
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}