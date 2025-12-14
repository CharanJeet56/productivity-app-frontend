<?xml version="1.0" encoding="UTF-8"?>
<mule xmlns:db="http://www.mulesoft.org/schema/mule/db" xmlns="http://www.mulesoft.org/schema/mule/core" xmlns:apikit="http://www.mulesoft.org/schema/mule/mule-apikit" xmlns:doc="http://www.mulesoft.org/schema/mule/documentation" xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core" xmlns:http="http://www.mulesoft.org/schema/mule/http" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd http://www.mulesoft.org/schema/mule/http http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd http://www.mulesoft.org/schema/mule/mule-apikit http://www.mulesoft.org/schema/mule/mule-apikit/current/mule-apikit.xsd http://www.mulesoft.org/schema/mule/ee/core http://www.mulesoft.org/schema/mule/ee/core/current/mule-ee.xsd 
http://www.mulesoft.org/schema/mule/db http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd">
    <http:listener-config name="employee-api-httpListenerConfig">
        <http:listener-connection host="0.0.0.0" port="8081" />
    </http:listener-config>
    <apikit:config name="employee-api-config" api="resource::9d1ade30-ec6e-4c77-9c3a-b52d71203a73:new-employee-api:1.0.0:raml:zip:employee-api.raml" outboundHeadersMapName="outboundHeaders" httpStatusVarName="httpStatus" />
    <db:config name="Database_Config" doc:name="Database Config" doc:id="6958d731-4506-4aab-a07b-5064fba1e3f6" >
		<db:my-sql-connection host="${db.host}" port="${db.port}" user="${db.user}" password="${db.password}" database="${db.database}" />
	</db:config>
	<configuration-properties doc:name="Configuration properties" doc:id="d72ee94d-16ff-4350-bcfe-6856c63886f3" file="config.yaml" />
	<flow name="employee-api-main">
        <http:listener config-ref="employee-api-httpListenerConfig" path="/api/*">
            <http:response statusCode="#[vars.httpStatus default 200]">
                <http:headers>#[vars.outboundHeaders default {}]</http:headers>
            </http:response>
            <http:error-response statusCode="#[vars.httpStatus default 500]">
                <http:body>#[payload]</http:body>
                <http:headers>#[vars.outboundHeaders default {}]</http:headers>
            </http:error-response>
        </http:listener>
        <apikit:router config-ref="employee-api-config" />
        <error-handler>
            <on-error-propagate type="APIKIT:BAD_REQUEST">
                <ee:transform doc:name="Transform Message">
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{message: "Bad request"}]]></ee:set-payload>
                    </ee:message>
                    <ee:variables>
                        <ee:set-variable variableName="httpStatus">400</ee:set-variable>
                    </ee:variables>
                </ee:transform>
            </on-error-propagate>
            <on-error-propagate type="APIKIT:NOT_FOUND">
                <ee:transform doc:name="Transform Message">
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{message: "Resource not found"}]]></ee:set-payload>
                    </ee:message>
                    <ee:variables>
                        <ee:set-variable variableName="httpStatus">404</ee:set-variable>
                    </ee:variables>
                </ee:transform>
            </on-error-propagate>
            <on-error-propagate type="APIKIT:METHOD_NOT_ALLOWED">
                <ee:transform doc:name="Transform Message">
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{message: "Method not allowed"}]]></ee:set-payload>
                    </ee:message>
                    <ee:variables>
                        <ee:set-variable variableName="httpStatus">405</ee:set-variable>
                    </ee:variables>
                </ee:transform>
            </on-error-propagate>
            <on-error-propagate type="APIKIT:NOT_ACCEPTABLE">
                <ee:transform doc:name="Transform Message">
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{message: "Not acceptable"}]]></ee:set-payload>
                    </ee:message>
                    <ee:variables>
                        <ee:set-variable variableName="httpStatus">406</ee:set-variable>
                    </ee:variables>
                </ee:transform>
            </on-error-propagate>
            <on-error-propagate type="APIKIT:UNSUPPORTED_MEDIA_TYPE">
                <ee:transform doc:name="Transform Message">
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{message: "Unsupported media type"}]]></ee:set-payload>
                    </ee:message>
                    <ee:variables>
                        <ee:set-variable variableName="httpStatus">415</ee:set-variable>
                    </ee:variables>
                </ee:transform>
            </on-error-propagate>
            <on-error-propagate type="APIKIT:NOT_IMPLEMENTED">
                <ee:transform doc:name="Transform Message">
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{message: "Not Implemented"}]]></ee:set-payload>
                    </ee:message>
                    <ee:variables>
                        <ee:set-variable variableName="httpStatus">501</ee:set-variable>
                    </ee:variables>
                </ee:transform>
            </on-error-propagate>
        </error-handler>
    </flow>
    <flow name="employee-api-console">
        <http:listener config-ref="employee-api-httpListenerConfig" path="/console/*">
            <http:response statusCode="#[vars.httpStatus default 200]">
                <http:headers>#[vars.outboundHeaders default {}]</http:headers>
            </http:response>
            <http:error-response statusCode="#[vars.httpStatus default 500]">
                <http:body>#[payload]</http:body>
                <http:headers>#[vars.outboundHeaders default {}]</http:headers>
            </http:error-response>
        </http:listener>
        <apikit:console config-ref="employee-api-config" />
        <error-handler>
            <on-error-propagate type="APIKIT:NOT_FOUND">
                <ee:transform doc:name="Transform Message">
                    <ee:message>
                        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{message: "Resource not found"}]]></ee:set-payload>
                    </ee:message>
                    <ee:variables>
                        <ee:set-variable variableName="httpStatus">404</ee:set-variable>
                    </ee:variables>
                </ee:transform>
            </on-error-propagate>
        </error-handler>
    </flow>
    <flow name="put:\employees\(id):application\json:employee-api-config">
        <ee:transform doc:name="Transform Message">
            <ee:variables>
                <ee:set-variable variableName="id">attributes.uriParams.'id'</ee:set-variable>
            </ee:variables>
        </ee:transform>
        <ee:transform doc:name="Transform Message">
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  id: 1,
  name: "John Doe",
  email: "john.doe@company.com",
  department: "IT",
  salary: 60000
} as Object {encoding: "UTF-8", mediaType: "application/json"}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
    <flow name="delete:\employees\(id):employee-api-config">
        <ee:transform doc:name="Transform Message">
            <ee:variables>
                <ee:set-variable variableName="id">attributes.uriParams.'id'</ee:set-variable>
            </ee:variables>
        </ee:transform>
        <logger level="INFO" message="delete:\employees\(id):employee-api-config" />
    </flow>
    <flow name="get:\employees:employee-api-config">
		<db:select doc:name="Select" doc:id="a59ecb4d-b2f1-4fd6-934d-b8e9d7e8d51c" config-ref="Database_Config">
			<db:sql ><![CDATA[SELECT * FROM employees;]]></db:sql>
		</db:select>
		<ee:transform doc:name="Transform Message" doc:id="3b39af33-845b-4cda-bcb2-543f50661639" >
			<ee:message >
				<ee:set-payload ><![CDATA[%dw 2.0
output application/json
---
payload]]></ee:set-payload>
			</ee:message>
		</ee:transform>
    </flow>
    <flow name="get:\employees\(id):employee-api-config">
        <ee:transform doc:name="Transform Message">
            <ee:variables>
                <ee:set-variable variableName="id">attributes.uriParams.'id'</ee:set-variable>
            </ee:variables>
        </ee:transform>
        <ee:transform doc:name="Transform Message">
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  id: 1,
  name: "John Doe",
  email: "john.doe@company.com",
  department: "IT",
  salary: 60000
} as Object {encoding: "UTF-8", mediaType: "application/json"}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
    <flow name="post:\employees:application\json:employee-api-config">
        <ee:transform doc:name="Transform Message">
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
  id: 1,
  name: "John Doe",
  email: "john.doe@company.com",
  department: "IT",
  salary: 60000
} as Object {encoding: "UTF-8", mediaType: "application/json"}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </flow>
</mule>
