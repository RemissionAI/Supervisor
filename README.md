# Supervisor
  ![Supervisor](./docs/assets/blackbox.png)

  Supervisor is and AI trained on scientific research papers about Lupus and Sjogren's syndrome for accurate analysis, designed to analyze patient health metrics and symptoms. It generates detailed reports to help patients understand potential symptom triggers, suggest lifestyle changes to manage symptoms, and identify symptoms requiring urgent care.

# Interface

## Inputs
- Patient Information Object
- Date
- Symptoms: {tag, description}
- Sleep Quality: Text
- Emotional State: {tag, description}
- Food Intake: Text
- Outdoor Activities: Text
- Physical Activity: Text
- Notes: Text
- **Medication Information**:
  - Current Medications: {name, dosage, frequency}
  - Changes in Medication: {previous medication, new medication, date of change}
- **Lab Results**:
  - Blood Tests: {type, result, date}
  - Urine Tests: {type, result, date}
  - Imaging Results: {type, finding, date}
- **Patient Demographics**:
  - Age
  - Gender
  - Weight
  - Height
- **Detailed Activity Data**:
  - Physical Activity Duration: in minutes
  - Intensity of Physical Activity: {low, moderate, high}
- **Stress Levels**: {scale, description}
- **Pain Levels**: {location, intensity (scale 1-10), duration}
- **Dietary Supplements**: {name, dosage, frequency}
- **Hydration**: Water Intake in liters
- **Sleep Data**:
  - Sleep Duration: in hours
  - Sleep Quality Metrics: {light sleep, deep sleep, REM sleep}
- **Environmental Factors**:
  - Pollution Levels: {AQI, description}
  - Humidity Levels: in percentage
- **External Data**:
  - IOS HealthApp Sleep Hours: Text
  - IOS HealthApp Distance (km): Text
  - Weather: Celsius

## Function

Generate a report that includes:
- EULAR/ACR 2019 Score Estimation
- Potential Triggers for Symptoms
- Positive Practices to Continue
- Estimated Fitness Metrics Based on Food Intake:
  - Calories
  - Protein
  - Carbohydrates
  - Fats
  - Water Intake
- Recommended Changes to Improve Symptoms
- Indicator if any symptoms require urgent attention

# Control Signals
**Ask**: Requests for additional information or clarification.

**Train**: Inputs used for training the system or updating its
knowledge base.

**Report**: Commands to generate reports based on the available data.

# Feedback Signals
**TQC** (Train Queue Count): The number of items or tasks waiting in the queue to be processed for training.

**RQC** (Report Queue Count): The number of reports waiting in the queue to be generated or processed.

# Schemas
## Input JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Patient Input Data",
  "type": "object",
  "properties": {
    "patient_id": {
      "type": "string"
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "symptoms": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "tag": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        },
        "required": ["tag", "description"]
      }
    },
    "sleep_quality": {
      "type": "string"
    },
    "emotional_state": {
      "type": "object",
      "properties": {
        "tag": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "required": ["tag", "description"]
    },
    "food_intake": {
      "type": "string"
    },
    "outdoor_activities": {
      "type": "string"
    },
    "physical_activity": {
      "type": "string"
    },
    "notes": {
      "type": "string"
    },
    "medication_information": {
      "type": "object",
      "properties": {
        "current_medications": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "dosage": {
                "type": "string"
              },
              "frequency": {
                "type": "string"
              }
            },
            "required": ["name", "dosage", "frequency"]
          }
        },
        "changes_in_medication": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "previous_medication": {
                "type": "string"
              },
              "new_medication": {
                "type": "string"
              },
              "date_of_change": {
                "type": "string",
                "format": "date"
              }
            },
            "required": ["previous_medication", "new_medication", "date_of_change"]
          }
        }
      }
    },
    "lab_results": {
      "type": "object",
      "properties": {
        "blood_tests": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "result": {
                "type": "string"
              },
              "date": {
                "type": "string",
                "format": "date"
              }
            },
            "required": ["type", "result", "date"]
          }
        },
        "urine_tests": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "result": {
                "type": "string"
              },
              "date": {
                "type": "string",
                "format": "date"
              }
            },
            "required": ["type", "result", "date"]
          }
        },
        "imaging_results": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "finding": {
                "type": "string"
              },
              "date": {
                "type": "string",
                "format": "date"
              }
            },
            "required": ["type", "finding", "date"]
          }
        }
      }
    },
    "patient_demographics": {
      "type": "object",
      "properties": {
        "age": {
          "type": "integer"
        },
        "gender": {
          "type": "string"
        },
        "weight": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      },
      "required": ["age", "gender", "weight", "height"]
    },
    "detailed_activity_data": {
      "type": "object",
      "properties": {
        "physical_activity_duration": {
          "type": "integer"
        },
        "intensity_of_physical_activity": {
          "type": "string"
        }
      },
      "required": ["physical_activity_duration", "intensity_of_physical_activity"]
    },
    "stress_levels": {
      "type": "object",
      "properties": {
        "scale": {
          "type": "integer"
        },
        "description": {
          "type": "string"
        }
      },
      "required": ["scale", "description"]
    },
    "pain_levels": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string"
          },
          "intensity": {
            "type": "integer"
          },
          "duration": {
            "type": "string"
          }
        },
        "required": ["location", "intensity", "duration"]
      }
    },
    "dietary_supplements": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "dosage": {
            "type": "string"
          },
          "frequency": {
            "type": "string"
          }
        },
        "required": ["name", "dosage", "frequency"]
      }
    },
    "hydration": {
      "type": "object",
      "properties": {
        "water_intake": {
          "type": "number"
        }
      },
      "required": ["water_intake"]
    },
    "sleep_data": {
      "type": "object",
      "properties": {
        "sleep_duration": {
          "type": "number"
        },
        "sleep_quality_metrics": {
          "type": "object",
          "properties": {
            "light_sleep": {
              "type": "number"
            },
            "deep_sleep": {
              "type": "number"
            },
            "rem_sleep": {
              "type": "number"
            }
          },
          "required": ["light_sleep", "deep_sleep", "rem_sleep"]
        }
      },
      "required": ["sleep_duration", "sleep_quality_metrics"]
    },
    "environmental_factors": {
      "type": "object",
      "properties": {
        "pollution_levels": {
          "type": "object",
          "properties": {
            "AQI": {
              "type": "integer"
            },
            "description": {
              "type": "string"
            }
          },
          "required": ["AQI", "description"]
        },
        "humidity_levels": {
          "type": "integer"
        }
      },
      "required": ["pollution_levels", "humidity_levels"]
    },
    "external_data": {
      "type": "object",
      "properties": {
        "ios_healthapp_sleep_hours": {
          "type": "string"
        },
        "ios_healthapp_distance_km": {
          "type": "string"
        },
        "weather": {
          "type": "string"
        }
      },
      "required": ["ios_healthapp_sleep_hours", "ios_healthapp_distance_km", "weather"]
    }
  },
  "required": [
    "patient_id",
    "date",
    "symptoms",
    "sleep_quality",
    "emotional_state",
    "food_intake",
    "outdoor_activities",
    "physical_activity",
    "notes",
    "medication_information",
    "lab_results",
    "patient_demographics",
    "detailed_activity_data",
    "stress_levels",
    "pain_levels",
    "dietary_supplements",
    "hydration",
    "sleep_data",
    "environmental_factors",
    "external_data"
  ]
}
```

## Output JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Patient Report Data",
  "type": "object",
  "properties": {
    "patient_id": {
      "type": "string"
    },
    "report_date": {
      "type": "string",
      "format": "date"
    },
    "eular_acr_2019_score_estimation": {
      "type": "integer"
    },
    "potential_triggers_for_symptoms": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "positive_practices_to_continue": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "estimated_fitness_metrics": {
      "type": "object",
      "properties": {
        "calories": {
          "type": "integer"
        },
        "protein": {
          "type": "integer"
        },
        "carbohydrates": {
          "type": "integer"
        },
        "fats": {
          "type": "integer"
        },
        "water_intake": {
          "type": "number"
        }
      },
      "required": ["calories", "protein", "carbohydrates", "fats", "water_intake"]
    },
    "recommended_changes_to_improve_symptoms": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "urgent_attention_required": {
      "type": "object",
      "properties": {
        "requires_attention": {
          "type": "boolean"
        },
        "symptoms_of_concern": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "tag": {
                "type": "string"
              },
              "description": {
                "type": "string"
              }
            },
            "required": ["tag", "description"]
          }
        }
      },
      "required": ["requires_attention", "symptoms_of_concern"]
    }
  },
  "required": [
    "patient_id",
    "report_date",
    "eular_acr_2019_score_estimation",
    "potential_triggers_for_symptoms",
    "positive_practices_to_continue",
    "estimated_fitness_metrics",
    "recommended_changes_to_improve_symptoms",
    "urgent_attention_required"
  ]
}
```
