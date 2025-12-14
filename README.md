<?xml version="1.0" encoding="UTF-8"?>

<mule xmlns:db="http://www.mulesoft.org/schema/mule/db"
      xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:apikit="http://www.mulesoft.org/schema/mule/mule-apikit"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core"
      xmlns="http://www.mulesoft.org/schema/mule/core"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
      http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd
      http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
      http://www.mulesoft.org/schema/mule/mule-apikit http://www.mulesoft.org/schema/mule/mule-apikit/current/mule-apikit.xsd
      http://www.mulesoft.org/schema/mule/db http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd
      http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd">

    <!-- ================= HTTP CONFIG ================= -->
    <http:listener-config name="httpListener">
        <http:listener-connection host="0.0.0.0" port="8081"/>
    </http:listener-config>

    <!-- ================= CONFIG YAML ================= -->
    <configuration-properties file="config.yaml"/>

    <!-- ================= DB CONFIG ================= -->
    <db:config name="dbConfig">
        <db:my-sql-connection
                host="${db.host}"
                port="${db.port}"
                user="${db.user}"
                password="${db.password}"
                database="${db.database}"/>
    </db:config>

    <!-- ================= APIKIT CONFIG ================= -->
    <apikit:config name="employee-api-config"
                   api="resource::employee-api-new:employee-api-new:1.0.0:raml:zip:employee-api.raml"
                   outboundHeadersMapName="outboundHeaders"
                   httpStatusVarName="httpStatus"/>

    <!-- ================= MAIN FLOW ================= -->
    <flow name="employee-api-main">
        <http:listener config-ref="httpListener" path="/api/*"/>

        <apikit:router config-ref="employee-api-config"/>

        <error-handler>

            <on-error-propagate type="APIKIT:BAD_REQUEST">
                <set-variable variableName="httpStatus" value="400"/>
                <set-payload value='{"message":"Bad Request"}' mimeType="application/json"/>
            </on-error-propagate>

            <on-error-propagate type="APIKIT:NOT_FOUND">
                <set-variable variableName="httpStatus" value="404"/>
                <set-payload value='{"message":"Resource Not Found"}' mimeType="application/json"/>
            </on-error-propagate>

            <on-error-propagate type="MULE:NOT_FOUND">
                <set-variable variableName="httpStatus" value="404"/>
                <set-payload value='{"message":"Employee Not Found"}' mimeType="application/json"/>
            </on-error-propagate>

            <on-error-propagate>
                <set-variable variableName="httpStatus" value="500"/>
                <set-payload value='{"message":"Internal Server Error"}' mimeType="application/json"/>
            </on-error-propagate>

        </error-handler>
    </flow>

    <!-- ================= GET ALL EMPLOYEES ================= -->
    <flow name="get:\employees:employee-api-config">
        <db:select config-ref="dbConfig">
            <db:sql>SELECT * FROM employees</db:sql>
        </db:select>
    </flow>

    <!-- ================= GET EMPLOYEE BY ID ================= -->
    <flow name="get:\employees\(id):employee-api-config">
        <set-variable variableName="id" value="#[attributes.uriParams.id]"/>

        <db:select config-ref="dbConfig">
            <db:sql>SELECT * FROM employees WHERE id = :id</db:sql>
            <db:input-parameters>
                #[{ id: vars.id }]
            </db:input-parameters>
        </db:select>

        <choice>
            <when expression="#[isEmpty(payload)]">
                <raise-error type="MULE:NOT_FOUND"/>
            </when>
        </choice>
    </flow>

    <!-- ================= CREATE EMPLOYEE ================= -->
    <flow name="post:\employees:application\json:employee-api-config">
        <db:insert config-ref="dbConfig">
            <db:sql>
                INSERT INTO employees (name,email,department,salary)
                VALUES (:name,:email,:department,:salary)
            </db:sql>
        </db:insert>

        <set-variable variableName="httpStatus" value="201"/>
        <set-payload value='{"message":"Employee Created"}' mimeType="application/json"/>
    </flow>

    <!-- ================= UPDATE EMPLOYEE ================= -->
    <flow name="put:\employees\(id):application\json:employee-api-config">
        <set-variable variableName="id" value="#[attributes.uriParams.id]"/>

        <db:update config-ref="dbConfig">
            <db:sql>
                UPDATE employees
                SET name=:name,email=:email,department=:department,salary=:salary
                WHERE id=:id
            </db:sql>
        </db:update>

        <choice>
            <when expression="#[payload == 0]">
                <raise-error type="MULE:NOT_FOUND"/>
            </when>
        </choice>

        <set-payload value='{"message":"Employee Updated"}' mimeType="application/json"/>
    </flow>

    <!-- ================= DELETE EMPLOYEE ================= -->
    <flow name="delete:\employees\(id):employee-api-config">
        <set-variable variableName="id" value="#[attributes.uriParams.id]"/>

        <db:delete config-ref="dbConfig">
            <db:sql>DELETE FROM employees WHERE id = :id</db:sql>
        </db:delete>

        <choice>
            <when expression="#[payload == 0]">
                <raise-error type="MULE:NOT_FOUND"/>
            </when>
        </choice>

        <set-payload value='{"message":"Employee Deleted"}' mimeType="application/json"/>
    </flow>

</mule>
