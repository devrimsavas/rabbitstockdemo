


const ProjectInfo=()=> {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">
          Event-Driven Microservices with RabbitMQ
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          This project demonstrates an{" "}
          <strong>event-driven architecture</strong>
          connecting two independent microservices — <em>Order Service</em> and
          <em> Inventory Service</em> — through <strong>RabbitMQ</strong>.
          Instead of communicating directly with APIs, these services exchange
          asynchronous events such as <code>order.created</code>,
          <code>order.confirmed</code>, and <code>order.rejected</code>.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The <strong>Order Service</strong> handles incoming purchase requests
          and publishes events to RabbitMQ. The{" "}
          <strong>Inventory Service</strong> listens to those events, checks
          product availability, updates stock, and responds with confirmation or
          rejection messages — creating a decoupled, reactive system.
        </p>

        <p className="text-md text-gray-600 italic">
          Built with Node.js, TypeScript, Express, Sequelize, RabbitMQ, and a
          React + Tailwind frontend for visualization.
        </p>
      </div>
    );
}

export default ProjectInfo;