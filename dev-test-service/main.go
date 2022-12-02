// Simple microservice written in Gin for testing purposes

package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

func main() {
	// Gin router
	router := gin.Default()

	// Private route
	// This route is only accessible if the user is authenticated
	router.GET("/private", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello from private route!",
		})
	})

	// Public routes. These routes are accessible to everyone

	// redirects "/" to "/public"
	router.GET("/", func(c *gin.Context) {
		c.Redirect(302, "/public")
	})

	// sample public route
	router.GET("/public", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello from public route!",
		})
	})

	// ping route
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Start and run the server at port 7777
	err := router.Run(":7777")
	if err != nil {
		// Print error if any
		fmt.Println(err)
	}

}
