# cacheData
 	APIs For Cache Data Handling. It's base URL is 
	#Base URL => Protocol://host:port/api/1.0.0/cacheData/ (http://localhost:3000/api/1.0.0/cacheData/)

# Endpoints
	GET => /getKeyData/:key (Key is required param)  --- To get key specefic data
	GET => /getKeyData   --- To get all key data
	
	POST => /setKeyData (Key & Value are required in body)   --- To Insert/Update key data
	
	PUT => /updtKeyData (Key & Value are required in body)   --- To update key data
	
	DELETE => /removeKeyData/:key (Key is required param)   --- To delete key specefic data
	DELETE => /removeAllKeyData   --- To delete all key data
	

# Setting & global variables (env & global JSON)
	Main settings are present in env file, like:-
		Database URL
		Database Name
		Collection Name
		Cache Data Limit
		Cache Data TTL
	Secondary messages and global variable are present in globals.json file, like:-
		"responses": {
			"successStatus": "success",
			"errorStatus": "error",
			"commonSuccessMessage": "Event Successful.",
			"commonErrorMessage": "An error occurred! Please try after sometime or contact to our support team.",
			"commonBlankData": []
		},
		"_dbs" : null
	Some helping functions are also present in GlobalFunc.js file, like:-
		logErrors
		logMissedKeys
		logHitKeys
		getRandomText
		validateDataLimit

# Features
	● Add an endpoint that returns the cached data for a given key
		○ If the key is not found in the cache:
			■ Log an output “Cache miss”
			■ Create a random string
			■ Update the cache with this random string
			■ Return the random string
		○ If the key is found in the cache:
			■ Log an output “Cache hit”
			■ Get the data for this key
			■ Return the data
	● Add an endpoint that returns all stored keys in the cache
	● Add an endpoint that creates/updates the data for a given key
	● Add an endpoint that removes a given key from the cache
	● Add an endpoint that removes all keys from the cache
	● The number of entries allowed in the cache is limited. If the maximum amount of
		cached items is reached, some old entry needs to be overwritten (Please explain the
		approach of what is overwritten in the comments of the source code)
	● Every cached item has a Time To Live (TTL). If the TTL is exceeded, the cached data will
		not be used. A new random value will then be generated (just like cache miss). The TTL
		will be reset on every read/cache hit
